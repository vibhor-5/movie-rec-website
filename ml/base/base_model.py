import torch 
from abc import ABC, abstractmethod
from typing import Any

class RecommenderModel(ABC):

    @abstractmethod
    def build(self,config: dict):
        """
        Build the model architecture.
        This method should be implemented by subclasses to define the model structure.
        """
        pass

    @abstractmethod
    def train_epoch(self, batch: tuple[torch.Tensor, torch.Tensor, torch.Tensor]) -> dict[str, float]:
        """
        Train the model for one epoch.
        This method should be implemented by subclasses to define the training logic for a single epoch.
        """
        pass

    @abstractmethod
    def train(self) -> Any:
        """
        Train the model.
        This method should be implemented by subclasses to define the training process.
        """
        pass

    @abstractmethod
    def test(self) -> Any:
        """
        Test the model.
        This method should be implemented by subclasses to define the testing process.
        """
        pass

    @abstractmethod
    def predict(self,  item_ids: torch.Tensor , ratings: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Predict scores for given user and item IDs.
        This method should be implemented by subclasses to define the prediction logic.
        this will predict scores for users who have no user existing embeddings, cold start users.
        """
        pass

    @abstractmethod
    def save(self,save_path: str):
        """
        Save the model.
        This method should be implemented by subclasses to define how the model is saved.
        """
        pass

    def load(self, load_path: str):
        """
        Load the model.
        This method should be implemented by subclasses to define how the model is loaded.
        """
        pass