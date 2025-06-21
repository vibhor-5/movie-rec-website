import torch 
import torch.nn as nn

class MatrixFactorizationModel(nn.Module):
    def __init__(self, num_users: int, num_items: int, embedding_dim: int = 64, dropout_rate: float =0.2):
        """
        Initialize the Matrix Factorization model.

        Args:
            num_users (int): Number of users.
            num_items (int): Number of items.
            embedding_dim (int): Dimension of the user and item embeddings.
        """
        super(MatrixFactorizationModel, self).__init__()
        self.user_embedding  = nn.Embedding(num_users, embedding_dim)
        self.item_embedding  = nn.Embedding(num_items, embedding_dim)

        self.user_bias = nn.Embedding(num_users, 1)
        self.item_bias = nn.Embedding(num_items, 1)
        self.global_bias = nn.Parameter(torch.zeros(1))
        
        # Dropout for regularization
        self.dropout = nn.Dropout(dropout_rate)
        
        # Initialize embeddings
        self._init_weights()
    
    def _init_weights(self):
        """Initialize embeddings with small random values"""
        nn.init.normal_(self.user_embedding.weight, 0, 0.1)
        nn.init.normal_(self.item_embedding.weight, 0, 0.1)
        
        nn.init.zeros_(self.user_bias.weight)
        nn.init.zeros_(self.item_bias.weight)

    def forward(self, user_ids: torch.Tensor, item_ids: torch.Tensor) -> torch.Tensor:
        """
        Forward pass to compute the predicted scores.

        Args:
            user_ids (torch.Tensor): Tensor of user IDs.
            item_ids (torch.Tensor): Tensor of item IDs.

        Returns:
            torch.Tensor: Predicted scores for the user-item pairs.
        """
        user_embeds : torch.Tensor = self.user_embedding(user_ids)
        item_embeds : torch.Tensor = self.item_embedding(item_ids)
        user_embeds = self.dropout(user_embeds)
        item_embeds = self.dropout(item_embeds)
        pred= (user_embeds * item_embeds).sum(dim=1)  # Dot product
        user_bias = self.user_bias(user_ids).squeeze()  # (batch_size,)
        item_bias = self.item_bias(item_ids).squeeze()  # (batch_size,)
        predictions = pred + user_bias + item_bias + self.global_bias

        return predictions
    
    
    def loss(self, loss_type:str, predictions: torch.Tensor, targets: torch.Tensor, l2_reg :float = 0.01) -> torch.Tensor:
        """
        Compute the loss between predictions and targets.

        Args:
            predictions (torch.Tensor): Predicted scores.
            targets (torch.Tensor): Ground truth scores.

        Returns:
            torch.Tensor: Computed loss.
        """
        
        if loss_type == 'bce_logits':
            # Use BCEWithLogitsLoss for numerical stability
            loss_fn = nn.BCEWithLogitsLoss()
            base_loss = loss_fn(predictions, targets)
        
        # Compute base loss
        else:
            loss_functions = {
                "mse": nn.MSELoss(),
                "mae": nn.L1Loss(), 
                "bce": nn.BCELoss(),
                "smoothl1": nn.SmoothL1Loss(),
                "huber": nn.HuberLoss()
            }
            if loss_type not in loss_functions:
                raise ValueError(f"Unsupported loss type: {loss_type}")
            if loss_type == 'bce':
                predictions = torch.sigmoid(predictions)
            base_loss = loss_functions[loss_type](predictions, targets)
        
        # Add L2 regularization
        l2_loss = 0
        for param in self.parameters():
            if param.requires_grad and len(param.shape) > 1:  # Only regularize embeddings
                l2_loss += torch.norm(param, p=2)
        
        total_loss = base_loss + l2_reg * l2_loss
        return total_loss