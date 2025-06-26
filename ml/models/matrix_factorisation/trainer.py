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
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score


class MatrixFactorizationTrainer(RecommenderModel):
    def build(self,config:dict):
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
        self.train_data,self.val_data, self.test_data = self.dataset.split_data()
        self.uid_map = self.dataset.uid_map
        self.mid_map = self.dataset.mid_map
        self.num_users = self.dataset.num_users
        self.num_items = self.dataset.num_items
        self.checkpoints_dir = config.get('checkpoints_dir', 'checkpoints') 
        os.makedirs(self.checkpoints_dir, exist_ok=True)

        self.latent_dim = config.get('embedding_dim', 64)
        self.model = MatrixFactorizationModel(
            num_users=self.num_users,
            num_items=self.num_items,
            embedding_dim=config.get('embedding_dim', 64),
            dropout_rate=config.get('dropout_rate', 0.2)
        ).to(self.device)

        print(self.model)

        self.l2_reg = config.get('l2_reg', 0.01)
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=config.get('learning_rate', 0.001))
        self.scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer, mode='min', patience=3, factor=0.5
        )
        self.loss_type = config.get('loss', 'bce_logits')
        self.is_binary = config.get('binarize', True)
        self.threshold = config.get('threshold', 0.5)
        
        # Check class distribution
        self._check_class_distribution()
        
    def _check_class_distribution(self):
        """Check the distribution of classes in the dataset"""
        if self.is_binary:
            # Get all ratings from training data
            train_ratings = []
            train_loader = self.dataset.get_dataloader(self.train_data, batch_size=1000)
            
            for batch in train_loader:
                _, _, ratings = batch
                train_ratings.extend(ratings.tolist())
            
            train_ratings = np.array(train_ratings)
            pos_count = np.sum(train_ratings == 1)
            neg_count = np.sum(train_ratings == 0)
            total = len(train_ratings)
            
            print(f"\n=== CLASS DISTRIBUTION ===")
            print(f"Positive samples (1): {pos_count} ({pos_count/total*100:.2f}%)")
            print(f"Negative samples (0): {neg_count} ({neg_count/total*100:.2f}%)")
            print(f"Total samples: {total}")
            print(f"Class ratio (pos/neg): {pos_count/neg_count:.3f}")
            
            # Calculate class weights for imbalanced data
            if pos_count > 0 and neg_count > 0:
                self.pos_weight = torch.tensor(neg_count / pos_count, device=self.device)
                print(f"Calculated pos_weight for BCEWithLogitsLoss: {self.pos_weight:.3f}")
            else:
                self.pos_weight = torch.tensor(1.0, device=self.device)
                print("Warning: One class is missing, using pos_weight=1.0")
            print("=" * 30)

    def train_epoch(self, batch: Tuple[torch.Tensor, torch.Tensor, torch.Tensor]) -> Dict[str,float]:
        user_ids, item_ids, ratings = batch
        self.optimizer.zero_grad()
        
        predictions = self.model(user_ids, item_ids)
        
        # Use pos_weight for imbalanced binary classification
        if self.is_binary and self.loss_type == 'bce_logits':
            loss_fn = nn.BCEWithLogitsLoss(pos_weight=self.pos_weight)
            loss = loss_fn(predictions, ratings)
            # Add L2 regularization manually
            l2_loss = 0
            for param in self.model.parameters():
                if param.requires_grad and len(param.shape) > 1:
                    l2_loss += torch.norm(param, p=2)
            loss = loss + self.l2_reg * l2_loss
        else:
            loss = self.model.loss(self.loss_type, predictions, ratings, self.l2_reg)
        
        loss.backward()
        torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
        self.optimizer.step()
        
        # Calculate batch metrics for monitoring
        batch_metrics = {'loss': loss.item()}
        
        if self.is_binary:
            with torch.no_grad():
                probs = torch.sigmoid(predictions)
                binary_preds = (probs >= self.threshold).float()
                
                # Calculate batch accuracy
                batch_acc = (binary_preds == ratings).float().mean().item()
                batch_metrics['batch_accuracy'] = batch_acc
                
                # Count predictions
                pred_pos = binary_preds.sum().item()
                pred_neg = (binary_preds == 0).sum().item()
                actual_pos = ratings.sum().item()
                actual_neg = (ratings == 0).sum().item()
                
                batch_metrics.update({
                    'pred_positive': pred_pos,
                    'pred_negative': pred_neg,
                    'actual_positive': actual_pos,
                    'actual_negative': actual_neg,
                    'avg_prediction_prob': probs.mean().item(),
                    'min_prediction_prob': probs.min().item(),
                    'max_prediction_prob': probs.max().item()
                })
        
        return batch_metrics
    
    def train(self) -> None:
        # Initialize wandb
        wandb.init(project=self.config.get('wandb_project', 'mf_training'), config=self.config)
        train_loader = self.dataset.get_dataloader(self.train_data, batch_size=self.config.get('batch_size', 64))
        val_loader = self.dataset.get_dataloader(self.val_data, batch_size=self.config.get('batch_size', 64)) if self.val_data else None

        for epoch in range(self.config.get('num_epochs', 10)):
            self.model.train()
            epoch_loss = 0.0
            epoch_metrics = {}
            
            progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}", leave=False)
            
            # Accumulate metrics across batches
            batch_count = 0
            for batch in progress_bar:
                metrics = self.train_epoch(tuple(x.to(self.device) for x in batch))
                batch_loss = metrics['loss']
                epoch_loss += float(batch_loss)
                
                # Accumulate other metrics
                for key, value in metrics.items():
                    if key != 'loss':
                        if key not in epoch_metrics:
                            epoch_metrics[key] = 0
                        epoch_metrics[key] += value
                
                batch_count += 1
                progress_bar.set_postfix({'loss': f"{batch_loss:.4f}"})
                
                # Log every 100 batches to avoid too much logging
                if batch_count % 100 == 0:
                    wandb.log({'batch_loss': batch_loss})

            # Calculate average metrics for the epoch
            avg_epoch_loss = epoch_loss / len(train_loader)
            for key in epoch_metrics:
                epoch_metrics[key] = epoch_metrics[key] / len(train_loader)
            
            print(f"\nEpoch {epoch+1}, Avg Loss: {avg_epoch_loss:.4f}")
            if self.is_binary:
                print(f"Avg Batch Accuracy: {epoch_metrics.get('batch_accuracy', 0):.4f}")
                print(f"Avg Prediction Probability: {epoch_metrics.get('avg_prediction_prob', 0):.4f}")
                print(f"Avg Predicted Positive: {epoch_metrics.get('pred_positive', 0):.2f}")
                print(f"Avg Predicted Negative: {epoch_metrics.get('pred_negative', 0):.2f}")
            
            wandb.log({'avg_epoch_loss': avg_epoch_loss, **epoch_metrics})
            
            if val_loader is not None:
                val_metrics = self.validate(val_loader)
                print(f"Validation metrics: {val_metrics}")
                wandb.log(val_metrics)
                
                # Use validation loss for scheduler
                self.scheduler.step(val_metrics['val_loss'])
                
            # Save model checkpoint
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.save(f"{self.checkpoints_dir}/{self.model_name}_model_epoch_{epoch+1}_{timestamp}.pth")
            
            if (epoch+1) % 5 == 0:
                test_results = self.test()
                print(f"Test results: {test_results}")
                wandb.log(test_results)

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
                
                # Calculate loss with same logic as training
                if self.is_binary and self.loss_type == 'bce_logits':
                    loss_fn = nn.BCEWithLogitsLoss(pos_weight=self.pos_weight)
                    loss = loss_fn(predictions, ratings)
                else:
                    loss = self.model.loss(self.loss_type, predictions, ratings, self.l2_reg)
                
                total_loss += loss.item()
                predictions_list.append(predictions.cpu())
                targets_list.append(ratings.cpu())
        
        all_predictions = torch.cat(predictions_list)
        all_targets = torch.cat(targets_list)
        
        metrics = {
            'val_loss': total_loss / len(val_loader)
        }
        
        if self.is_binary:
            # For binary classification metrics
            # Convert logits to probabilities using sigmoid
            probabilities = torch.sigmoid(all_predictions)
            
            # Convert probabilities to binary predictions using threshold
            binary_predictions = (probabilities >= self.threshold).float()
            
            # Convert to numpy for sklearn metrics
            y_true = all_targets.numpy()
            y_pred = binary_predictions.numpy()
            y_prob = probabilities.numpy()
            
            # Print distribution for debugging
            print(f"\nValidation Prediction Distribution:")
            print(f"Predicted 1s: {np.sum(y_pred == 1)} / {len(y_pred)} ({np.mean(y_pred)*100:.2f}%)")
            print(f"Actual 1s: {np.sum(y_true == 1)} / {len(y_true)} ({np.mean(y_true)*100:.2f}%)")
            print(f"Avg prediction probability: {np.mean(y_prob):.4f}")
            print(f"Min/Max prediction probability: {np.min(y_prob):.4f} / {np.max(y_prob):.4f}")
            
            # Calculate binary classification metrics
            try:
                # Calculate confusion matrix components
                tn = np.sum((y_true == 0) & (y_pred == 0))
                tp = np.sum((y_true == 1) & (y_pred == 1))
                fn = np.sum((y_true == 1) & (y_pred == 0))
                fp = np.sum((y_true == 0) & (y_pred == 1))
                
                print(f"Confusion Matrix: TP={tp}, TN={tn}, FP={fp}, FN={fn}")
                
                metrics.update({
                    'accuracy': accuracy_score(y_true, y_pred),
                    'precision': precision_score(y_true, y_pred, zero_division=0),
                    'recall': recall_score(y_true, y_pred, zero_division=0),
                    'f1_score': f1_score(y_true, y_pred, zero_division=0),
                    'auc_roc': roc_auc_score(y_true, y_prob) if len(np.unique(y_true)) > 1 else 0.0,
                    'true_positives': int(tp),
                    'true_negatives': int(tn),
                    'false_positives': int(fp),
                    'false_negatives': int(fn),
                    'avg_pred_prob': float(np.mean(y_prob)),
                    'std_pred_prob': float(np.std(y_prob))
                })
                
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
    
    def predict(self, item_ids: torch.Tensor, ratings: torch.Tensor ) -> tuple[torch.Tensor, torch.Tensor]:
        self.model.eval()

        user_emb = nn.Parameter(torch.randn(self.latent_dim, device=self.device, requires_grad=True))
        optimiser = torch.optim.Adam([user_emb], lr=0.01)

        # Ensure item_ids and ratings are on the correct device
        item_ids = item_ids.to(self.device)
        ratings = ratings.to(self.device)

        item_embs = self.model.item_embedding(item_ids).detach()  # (N, D)

        for epoch in range(100):
            preds = (user_emb * item_embs).sum(dim=1)  # (N,)
            
            if self.is_binary:
                # For binary classification, use BCE loss
                preds_sigmoid = torch.sigmoid(preds)
                loss = F.binary_cross_entropy(preds_sigmoid, ratings)
            else:
                # For regression, use MSE loss
                loss = F.mse_loss(preds, ratings)
                
            loss.backward()
            optimiser.step()
            optimiser.zero_grad()

        # Predict for all items
        all_item_embs = self.model.item_embedding.weight  # (num_items, D)
        predictions = torch.matmul(user_emb, all_item_embs.T)  # (num_items,)
        
        if self.is_binary:
            # Convert logits to probabilities for binary classification
            predictions = torch.sigmoid(predictions)
            
        predictions, predicted_ids = predictions.sort(descending=True)

        return predictions[:20], predicted_ids[:20]
    
    def save(self, save_path: str) -> None:
        """
        Save the model to the specified path.
        
        Args:
            save_path (str): Path to save the model.
        """
        torch.save(self.model.state_dict(), save_path)

    def load(self, load_path: str) -> None:
        """
        Load the model from the specified path.
        
        Args:
            load_path (str): Path to load the model from.
        """
        self.model.load_state_dict(torch.load(load_path))
        self.model.to(self.device)
        self.model.eval()
        print(f"Model loaded from {load_path}")