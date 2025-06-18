import torch 
import torch.nn as nn

class MatrixFactorizationModel(nn.Module):
    def __init__(self, num_users: int, num_items: int, embedding_dim: int = 64):
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
        return (user_embeds * item_embeds).sum(dim=1)  # Dot product
    
    def loss(self, losstype:str, predictions: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        """
        Compute the loss between predictions and targets.

        Args:
            predictions (torch.Tensor): Predicted scores.
            targets (torch.Tensor): Ground truth scores.

        Returns:
            torch.Tensor: Computed loss.
        """
        lossdic={
            "mse": nn.MSELoss(),
            "bce": nn.BCELoss(),
            "mae": nn.L1Loss(),
            "hinge": nn.HingeEmbeddingLoss(),
            "smoothl1": nn.SmoothL1Loss()
        }
        return lossdic[losstype](predictions, targets)