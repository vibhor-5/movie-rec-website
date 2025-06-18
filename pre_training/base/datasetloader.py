import polars
import os
from torch.utils.data import Dataset, DataLoader

class RecommenderDataset(Dataset):
    def __init__(self, data: polars.DataFrame):
        """
        Initialize the dataset with a Polars DataFrame.

        Args:
            data (polars.DataFrame): DataFrame containing user-item interactions.
        """
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data[idx]
        user_id = row['user_id']
        item_id = row['item_id']
        rating = row['rating']
        return user_id, item_id, rating
    
class DatasetLoader:
    def __init__(self,path:str,dataset_type:str="csv",batch_size:int =64, binarize:bool=False):
        """
        Initialize the DatasetLoader.

        Args:
            path (str): Path to the dataset file.
            dataset (str): Type of dataset file (e.g., 'csv', 'parquet').
            batch_size (int): Batch size for DataLoader.
            binarize (bool): Whether to binarize the ratings.
        """
        