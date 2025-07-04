from datetime import datetime
import numpy as np
import os
from base.base_model import RecommenderModel
from models.matrix_factorisation.model import MatrixFactorizationModel
from base.datasetloader import DatasetLoader
from typing import Dict, Tuple
from torch.utils.data import DataLoader
import torch
import torch.nn as nn
import torch.nn.functional as F
import wandb
from tqdm import tqdm
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from predict_model import prediction_model

class MatrixFactorizationTrainer(RecommenderModel):

    def build(self,config:dict,trainable:bool=True):
        self.config = config
        self.model_name = config.get('model_name', 'matrix_factorization')
        self.device= torch.device('cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu')
        self.dataset= DatasetLoader(
            path=config['data_path'],
            dataset_type=config.get('dataset_type', 'csv'),
            separator=config.get('separator', ','),
            batch_size=config.get('batch_size', 64),
            binarize=config.get('binarize', False),
            min_rating=config.get('min_rating', 1)
        )
        
        self.uid_map = self.dataset._uid_map
        self.mid_map = self.dataset._mid_map
        self.num_users = self.dataset.num_users
        self.num_items = self.dataset.num_items
        self.latent_dim = config.get('embedding_dim', 64)
        self.model = MatrixFactorizationModel(
            num_users=self.num_users,
            num_items=self.num_items,
            embedding_dim=config.get('embedding_dim', 64),
            dropout_rate=config.get('dropout_rate', 0.2)
        ).to(self.device)

        print(self.model)

        self.loss_type = config.get('loss', 'bce_logits')
        self.is_binary = config.get('binarize', True)
        self.threshold = config.get('threshold', 0.5)
        self.l2_reg = config.get('l2_reg', 0.01)
        self.pos_weight = self._calculate_pos_weight()
        print(f"Calculated pos_weight: {self.pos_weight}")

        if trainable:
            self.checkpoints_dir = config.get('checkpoints_dir', 'checkpoints') 
            os.makedirs(self.checkpoints_dir, exist_ok=True)
            self.train_data,self.val_data, self.test_data = self.dataset.split_data()
            self.optimizer = torch.optim.Adam(self.model.parameters(), lr=config.get('learning_rate', 0.001))
            self.scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
                self.optimizer, mode='min', patience=5, factor=0.3
            )
            self.early_stopping_patience = config.get('early_stopping_patience', 10)
            self.best_val_loss = float('inf')
            self.patience_counter = 0
            self.best_model_state = None
        
   
    def _calculate_pos_weight(self) -> float:
        """Calculate positive class weight for handling class imbalance"""
        if not self.is_binary:
            return 1.0
            
        # Count positive and negative samples in training data
        train_loader = self.dataset.get_dataloader(self.train_data, batch_size=1024)
        pos_count = 0
        neg_count = 0
        
        with torch.no_grad():
            for batch in train_loader:
                _, _, ratings = batch
                pos_count += (ratings == 1).sum().item()
                neg_count += (ratings == 0).sum().item()
        
        if pos_count == 0:
            return 1.0
            
        pos_weight = neg_count / pos_count
        print(f"Dataset stats - Positive: {pos_count}, Negative: {neg_count}")
        return min(pos_weight, 10.0)  # Cap the weight to prevent extreme values

    def train_epoch(self, batch: Tuple[torch.Tensor, torch.Tensor, torch.Tensor]) -> Dict[str,float]:
        user_ids, item_ids, ratings = batch
        self.optimizer.zero_grad()
        
        predictions = self.model(user_ids, item_ids)
        loss = self.model.loss(self.loss_type, predictions, ratings, self.l2_reg, self.pos_weight)
        
        loss.backward()
        # Gradient clipping for stability
        torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=0.5)
        self.optimizer.step()
        
        # Calculate batch metrics for monitoring
        batch_metrics = {'loss': loss.item()}
        
        return batch_metrics
    
    def train(self) -> None:
        wandb.init(project=self.config.get('wandb_project', 'mf_training'), config=self.config)
        train_loader = self.dataset.get_dataloader(self.train_data, batch_size=self.config.get('batch_size', 64))
        val_loader = self.dataset.get_dataloader(self.val_data, batch_size=self.config.get('batch_size', 64)) if self.val_data else None

        for epoch in range(self.config.get('num_epochs', 10)):
            self.model.train()
            epoch_loss = 0.0
            
            progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}", leave=False)
            
            # Accumulate metrics across batches
            batch_count = 0
            for batch in progress_bar:
                metrics = self.train_epoch(tuple(x.to(self.device) for x in batch))
                batch_loss = metrics['loss']
                epoch_loss += float(batch_loss)
                batch_count += 1
                progress_bar.set_postfix({'loss': f"{batch_loss:.4f}"})
                
                # Log every 100 batches to avoid too much logging
                if batch_count % 100 == 0:
                    wandb.log({'batch_loss': batch_loss})

            # Calculate average metrics for the epoch
            avg_epoch_loss = epoch_loss / len(train_loader)
            print(f"\nEpoch {epoch+1}, Avg Loss: {avg_epoch_loss:.4f}")
            
            wandb.log({'avg_epoch_loss': avg_epoch_loss, 'epoch': epoch+1})
            
            if val_loader is not None:
                val_metrics = self.validate(val_loader)
                print(f"Validation metrics: {val_metrics}")
                wandb.log({**val_metrics, 'epoch': epoch+1})
                
                # Early stopping check
                val_loss = val_metrics['val_loss']
                if val_loss < self.best_val_loss:
                    self.best_val_loss = val_loss
                    self.patience_counter = 0
                    # Save best model state
                    self.best_model_state = self.model.state_dict().copy()
                    print(f"New best validation loss: {val_loss:.4f}")
                else:
                    self.patience_counter += 1
                    print(f"No improvement. Patience: {self.patience_counter}/{self.early_stopping_patience}")
                
                # Use validation loss for scheduler
                self.scheduler.step(val_loss)
                
                # Early stopping
                if self.patience_counter >= self.early_stopping_patience:
                    print(f"Early stopping triggered after {epoch+1} epochs")
                    break
                
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.save(f"{self.checkpoints_dir}/{self.model_name}_model_epoch_{epoch+1}_{timestamp}.pth")
            if (epoch+1) % 5 == 0: 
                test_results = self.test()
                print(f"Test results: {test_results}")
                test_results_prefixed = {f"test_{k}": v for k, v in test_results.items()}
                wandb.log({**test_results_prefixed, 'epoch': epoch+1})

        # Load best model if early stopping was used
        if self.best_model_state is not None:
            self.model.load_state_dict(self.best_model_state)
            print("Loaded best model from early stopping")
            
        # Final save
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.save(f"{self.checkpoints_dir}/{self.model_name}_final_{timestamp}.pth")
        
        wandb.finish()

    def validate(self, val_loader: DataLoader) -> Dict[str, float]:
        self.model.eval()
        total_loss = 0.0
        predictions_list = []
        targets_list = []
        
        with torch.no_grad():
            for batch in val_loader:
                user_ids, item_ids, ratings = [x.to(self.device) for x in batch]
                predictions = self.model(user_ids, item_ids)
                loss = self.model.loss(self.loss_type, predictions, ratings, self.l2_reg, self.pos_weight)
                
                total_loss += loss.item()
                predictions_list.append(predictions.cpu())
                targets_list.append(ratings.cpu())
        
        all_predictions = torch.cat(predictions_list)
        all_targets = torch.cat(targets_list)
        
        metrics = {
            'val_loss': total_loss / len(val_loader)
        }
        
        if self.is_binary:
            probabilities = torch.sigmoid(all_predictions)
            
            # Convert probabilities to binary predictions using threshold
            binary_predictions = (probabilities >= self.threshold).float()
            
            # Convert to numpy for sklearn metrics
            y_true = all_targets.numpy()
            y_pred = binary_predictions.numpy()
            y_prob = probabilities.numpy()
            
            # Print distribution for debugging
            print("\nValidation Stats:")
            print(f"Predicted 1s: {np.sum(y_pred == 1)} / {len(y_pred)} ({np.mean(y_pred)*100:.2f}%)")
            print(f"Actual 1s: {np.sum(y_true == 1)} / {len(y_true)} ({np.mean(y_true)*100:.2f}%)")
            print(f"Avg prediction probability: {np.mean(y_prob):.4f}")
            print(f"Prediction probability range: [{np.min(y_prob):.4f}, {np.max(y_prob):.4f}]")
            
            # Calculate binary classification metrics
            try:
                # Calculate confusion matrix components
                tn = np.sum((y_true == 0) & (y_pred == 0))
                tp = np.sum((y_true == 1) & (y_pred == 1))
                fn = np.sum((y_true == 1) & (y_pred == 0))
                fp = np.sum((y_true == 0) & (y_pred == 1))
                
                print(f"Confusion Matrix: TP={tp}, TN={tn}, FP={fp}, FN={fn}")
                
                metrics.update(
                    accuracy=float(accuracy_score(y_true, y_pred)),
                    precision=float(precision_score(y_true, y_pred, zero_division=0)),
                    recall=float(recall_score(y_true, y_pred, zero_division=0)),
                    f1_score=float(f1_score(y_true, y_pred, zero_division=0)),
                    auc_roc=float(roc_auc_score(y_true, y_prob)) if len(np.unique(y_true)) > 1 else 0.0,
                    true_positives=int(tp),
                    true_negatives=int(tn),
                    false_positives=int(fp),
                    false_negatives=int(fn),
                    avg_pred_prob=float(np.mean(y_prob)),
                    std_pred_prob=float(np.std(y_prob))
                )
                
                # Calculate specificity
                specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0
                metrics['specificity'] = specificity
                
            except Exception as e:
                print(f"Warning: Could not calculate some binary metrics: {e}")
                # Fallback to basic metrics
                metrics.update({
                    'accuracy': 0.0,
                    'precision': 0.0,
                    'recall': 0.0,
                    'f1_score': 0.0,
                    'auc_roc': 0.0
                })
        else:
            # For regression metrics
            mae = F.l1_loss(all_predictions, all_targets).item()
            mse = F.mse_loss(all_predictions, all_targets).item()
            rmse = np.sqrt(mse)
            
            metrics.update({
                'mae': mae,
                'mse': mse, 
                'rmse': rmse
            })

        return metrics
    
    def test(self) -> Dict[str, float]:
        self.model.eval()
        test_loader = self.dataset.get_dataloader(self.test_data, batch_size=self.config.get('batch_size', 64))
        
        # Use the same validation logic for test set
        test_metrics = self.validate(test_loader)
        
        # Rename val_loss to test_loss
        if 'val_loss' in test_metrics:
            test_metrics['test_loss'] = test_metrics.pop('val_loss')
            
        return test_metrics
    
    def predict(self, item_ids: torch.Tensor, ratings: torch.Tensor,k:int =10 ) -> Tuple[torch.Tensor, torch.Tensor]:
        
        self.model.eval()
        item_ids = item_ids.to(self.device)
        ratings = ratings.to(self.device)
        user_emb_model=prediction_model(self.latent_dim,device=self.device)
        
        with torch.no_grad():
            item_embs = self.model.item_embedding(item_ids).detach()
            item_bias=self.model.item_bias(item_ids).detach()
        
        user_emb=user_emb_model.train_model(item_embs,ratings,item_bias,loss_type="bce_logits",
            num_epochs=15,pos_weight=self.pos_weight,l2_reg=0.002,lr=0.001)
        
        with torch.no_grad():
            all_item_embs = self.model.item_embedding.weight  # (num_items, D)
            predictions = torch.matmul(user_emb, all_item_embs.T)  # (num_items,)    
            if self.is_binary:
                predictions = torch.sigmoid(predictions)
            predictions, predicted_ids = predictions.sort(descending=True)

        return predictions[:k].cpu(), predicted_ids[:k].cpu()
    
    def save(self, save_path: str) -> None:
        torch.save(self.model.state_dict(), save_path)

    def load(self, load_path: str,trainable:bool=False) -> None:
        self.model.load_state_dict(torch.load(load_path))
        self.model.to(self.device)
        if not trainable:
            self.model.eval()
        else:
            self.model.train()
        print(f"Model loaded from {load_path}")