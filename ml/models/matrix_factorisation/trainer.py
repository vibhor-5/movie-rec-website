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
            embedding_dim=config.get('embedding_dim', 64)
        ).to(self.device)

        print(self.model)

        self.l2_reg = config.get('l2_reg', 0.01)
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=config.get('learning_rate', 0.001))
        self.scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer, mode='min', patience=3, factor=0.5
        )
        self.loss_type = config.get('loss', 'mse')
        
        

    def train_epoch(self, batch: Tuple[torch.Tensor, torch.Tensor, torch.Tensor]) -> Dict[str,float]:
        """
        Perform a single training step.
        
        Args:
            batch (Tuple[torch.Tensor, torch.Tensor, torch.Tensor]): A batch of user IDs, item IDs, and ratings.
        
        Returns:
            Dict[str, torch.Tensor]: Dictionary containing the loss and predictions.
        """
        user_ids, item_ids, ratings = batch
        self.optimizer.zero_grad()
        
        predictions = self.model(user_ids, item_ids)
        loss = self.model.loss(self.loss_type, predictions, ratings,self.l2_reg)
        
        loss.backward()
        torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
        self.optimizer.step()
        
        return {'loss': loss.item(), 'predictions': predictions}
    
    def train(self) -> None:
        # Initialize wandb
        wandb.init(project=self.config.get('wandb_project', 'mf_training'), config=self.config)
        train_loader = self.dataset.get_dataloader(self.train_data, batch_size=self.config.get('batch_size', 64))
        val_loader = self.dataset.get_dataloader(self.val_data, batch_size=self.config.get('batch_size', 64)) if self.val_data else None

        # if val_loader is not None:
        #     self.val_loader = val_loader
        # else:
        #     self.val_loader = None

        for epoch in range(self.config.get('num_epochs', 10)):
            self.model.train()
            epoch_loss = 0.0
            progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}", leave=False)
            for batch in progress_bar:
                metrics = self.train_epoch(tuple(x.to(self.device) for x in batch))
                batch_loss = metrics['loss']
                epoch_loss += float(batch_loss)
                progress_bar.set_postfix({'loss': batch_loss})
                wandb.log({'batch_loss': batch_loss, 'epoch': epoch+1})

            avg_epoch_loss = epoch_loss / len(train_loader)
            print(f"Epoch {epoch+1}, Avg Loss: {avg_epoch_loss:.4f}")
            wandb.log({'avg_epoch_loss': avg_epoch_loss, 'epoch': epoch+1})
            if val_loader is not None:
                val_metrics = self.validate(val_loader)
                print(f"Epoch {epoch+1},", val_metrics)
                wandb.log(val_metrics)
            # Save model checkpoint
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.save(f"{self.checkpoints_dir}/{self.model_name}_model_epoch_{epoch+1}_{timestamp}.pth")

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
                loss = self.model.loss(self.loss_type, predictions, ratings, self.l2_reg)
                
                total_loss += loss.item()
                predictions_list.append(predictions.cpu())
                targets_list.append(ratings.cpu())
        
        all_predictions = torch.cat(predictions_list)
        all_targets = torch.cat(targets_list)
        
        # Calculate additional metrics
        mae = F.l1_loss(all_predictions, all_targets).item()
        mse = F.mse_loss(all_predictions, all_targets).item()
        rmse = np.sqrt(mse)

        return {
            'val_loss': total_loss / len(val_loader),
            'mae': mae,
            'mse': mse, 
            'rmse': rmse
        }
    
    def test(self) -> Dict[str, float]:
        self.model.eval()
        test_loader = self.dataset.get_dataloader(self.test_data, batch_size=self.config.get('batch_size', 64))
        total_loss = 0.0
        with torch.no_grad():
            for batch in test_loader:
                user_ids, item_ids, ratings = (x.to(self.device) for x in batch)
                predictions = self.model(user_ids, item_ids)
                loss = self.model.loss(self.loss_type, predictions, ratings)
                total_loss += loss.item()

        return {'test_loss': total_loss / len(test_loader)}
    
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
            loss = nn.MSELoss()(preds, ratings)        # (N,) vs (N,)
            loss.backward()
            optimiser.step()
            optimiser.zero_grad()

        # Predict for all items
        all_item_embs = self.model.item_embedding.weight  # (num_items, D)
        predictions = torch.matmul(user_emb, all_item_embs.T)  # (num_items,)
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
    

        
        

        