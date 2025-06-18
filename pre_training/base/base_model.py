import polars as pl
import torch 
from abc import ABC, abstractmethod

class RecommenderModel(ABC):

    @abstractmethod
    def build(self,config: dict):
        """
        Build the model architecture.
        This method should be implemented by subclasses to define the model structure.
        """
        pass

    @abstractmethod
    def train_epoch(self,train_loader: pl.DataFrame, val_loader: pl.DataFrame | None = None):
        """
        Train the model for one epoch.
        This method should be implemented by subclasses to define the training logic for a single epoch.
        """
        pass

    @abstractmethod
    def train(self,train_df:pl.DataFrame,val_loader:pl.DataFrame | None = None):
        """
        Train the model.
        This method should be implemented by subclasses to define the training process.
        """
        pass

    @abstractmethod
    def test(self,test_df:pl.DataFrame):
        """
        Test the model.
        This method should be implemented by subclasses to define the testing process.
        """
        pass

    @abstractmethod
    def predict(self, user_ids: torch.Tensor, item_ids: torch.Tensor | None) -> torch.Tensor:
        """
        Predict scores for given user and item IDs.
        This method should be implemented by subclasses to define the prediction logic.
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