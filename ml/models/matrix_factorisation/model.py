import torch 
import torch.nn as nn

class MatrixFactorizationModel(nn.Module):
    def __init__(self, num_users: int, num_items: int, embedding_dim: int = 64, dropout_rate: float = 0.2):
        """
        Initialize the Matrix Factorization model.

        Args:
            num_users (int): Number of users.
            num_items (int): Number of items.
            embedding_dim (int): Dimension of the user and item embeddings.
        """
        super(MatrixFactorizationModel, self).__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)

        self.user_bias = nn.Embedding(num_users, 1)
        self.item_bias = nn.Embedding(num_items, 1)
        self.global_bias = nn.Parameter(torch.zeros(1))
        
        # Batch normalization for embeddings
        self.user_bn = nn.BatchNorm1d(embedding_dim)
        self.item_bn = nn.BatchNorm1d(embedding_dim)
        
        # Dropout for regularization
        self.dropout = nn.Dropout(dropout_rate)
        
        # Initialize embeddings
        self._init_weights()
    
    def _init_weights(self):
        """Initialize embeddings with small random values"""
        # Use smaller initialization for better stability
        nn.init.normal_(self.user_embedding.weight, 0, 0.05)
        nn.init.normal_(self.item_embedding.weight, 0, 0.05)
        
        # Initialize biases to zeros for stability
        nn.init.zeros_(self.user_bias.weight)
        nn.init.zeros_(self.item_bias.weight)
        
        # Initialize global bias to zero
        nn.init.constant_(self.global_bias, 0.0)

    def forward(self, user_ids: torch.Tensor, item_ids: torch.Tensor) -> torch.Tensor:
        """
        Forward pass to compute the predicted scores.

        Args:
            user_ids (torch.Tensor): Tensor of user IDs.
            item_ids (torch.Tensor): Tensor of item IDs.

        Returns:
            torch.Tensor: Predicted scores for the user-item pairs.
        """
        user_embeds: torch.Tensor = self.user_embedding(user_ids)
        item_embeds: torch.Tensor = self.item_embedding(item_ids)
        
        # Apply batch normalization
        user_embeds = self.user_bn(user_embeds)
        item_embeds = self.item_bn(item_embeds)
        
        # Apply dropout only during training
        if self.training:
            user_embeds = self.dropout(user_embeds)
            item_embeds = self.dropout(item_embeds)
        
        pred = (user_embeds * item_embeds).sum(dim=1)  # Dot product
        user_bias = self.user_bias(user_ids).squeeze()  # (batch_size,)
        item_bias = self.item_bias(item_ids).squeeze()  # (batch_size,)
        predictions = pred + user_bias + item_bias + self.global_bias

        return predictions
    
    def loss(self, loss_type: str, predictions: torch.Tensor, targets: torch.Tensor, l2_reg: float = 0.01, pos_weight: float = 1.0) -> torch.Tensor:
        """
        Compute the loss between predictions and targets.

        Args:
            loss_type (str): Type of loss function to use.
            predictions (torch.Tensor): Predicted scores.
            targets (torch.Tensor): Ground truth scores.
            l2_reg (float): L2 regularization strength.
            pos_weight (float): Weight for positive class in BCE loss.

        Returns:
            torch.Tensor: Computed loss.
        """
        
        if loss_type == 'bce_logits':
            # Use BCEWithLogitsLoss with pos_weight for class imbalance
            pos_weight_tensor = torch.tensor(pos_weight, device=predictions.device)
            loss_fn = nn.BCEWithLogitsLoss(pos_weight=pos_weight_tensor)
            base_loss = loss_fn(predictions, targets)
        else:
            # Compute base loss
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
        
        # Add L2 regularization only to embeddings (not biases)
        l2_loss = 0
        l2_loss += torch.norm(self.user_embedding.weight, p=2)
        l2_loss += torch.norm(self.item_embedding.weight, p=2)
        
        total_loss = base_loss + l2_reg * l2_loss
        return total_loss