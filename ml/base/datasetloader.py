import torch
import polars as pl
from torch.utils.data import Dataset, DataLoader
from typing import Tuple, Dict

class RecommenderDataset(Dataset):
    def __init__(self, data: pl.DataFrame):
        """
        Initialize the dataset with a Polars DataFrame.

        Args:
            data (polars.DataFrame): DataFrame containing user-item interactions.
        """
        self.user_ids = data['user_id'].to_list()
        self.movie_ids = data['movie_id'].to_list()
        self.ratings = data['rating'].to_list()

    def __len__(self):
        return len(self.user_ids)

    def __getitem__(self, idx):
        
        user_id = torch.tensor(self.user_ids[idx], dtype=torch.long)
        movie_id = torch.tensor(self.movie_ids[idx], dtype=torch.long)
        rating = torch.tensor(self.ratings[idx], dtype=torch.float32)
        return user_id, movie_id, rating
    
class DatasetLoader:
    def __init__(self,path:str,dataset_type:str="csv",separator:str=",",val_ratio:float=0.1,test_ratio:float=0.2,batch_size:int =64, binarize:bool=False,min_rating:int=1):
        """
        Initialize the DatasetLoader.

        Args:
            path (str): Path to the dataset file.
            dataset_type (str): Type of dataset file (e.g., 'csv', 'parquet').
            batch_size (int): Batch size for DataLoader.
            binarize (bool): Whether to binarize the ratings.
        """
        if dataset_type not in ["csv", "parquet"]:
            raise ValueError("Unsupported dataset type. Use 'csv' or 'parquet'.")
        
        self._uid_map,self._mid_map,self.data= self.load_data(path, dataset_type,separator,binarize,min_rating)
        self.batch_size = batch_size
        self.val_ratio = val_ratio
        self.test_ratio = test_ratio
        self.num_users = len(self._uid_map)
        self.num_items = len(self._mid_map) 
        self.train_data, self.val_data, self.test_data = self.split_data()



    def load_data(self, path: str, dataset_type: str, separator:str , binarize: bool, min_rating: int) -> Tuple[Dict, Dict, pl.DataFrame]:
        """
        Load the dataset from a file.

        Args:
            path (str): Path to the dataset file.
            dataset_type (str): Type of dataset file (e.g., 'csv', 'parquet').
            binarize (bool): Whether to binarize the ratings.
            min_rating (int): Minimum rating for binarization.

        Returns:
            polars.DataFrame: Loaded dataset as a Polars DataFrame.
        """
        if dataset_type == "parquet":
            data = pl.read_parquet(path)
        else:
            data= pl.read_csv(path,
                              separator=separator,
                              has_header=True,
                              new_columns=["user_id", "movie_id", "rating","timestamp"],
                              )
        
        if binarize:
            data = data.with_columns(
                pl.when(pl.col('rating') >= min_rating).then(1).otherwise(0).alias('rating')
            )
        unique_users = data["user_id"].to_list()
        unique_movies = data["movie_id"].to_list()
        uid_map= {uid: i for i, uid in enumerate(unique_users)}
        mid_map= {mid: i for i, mid in enumerate(unique_movies)}

        data = data.with_columns(
            pl.col('user_id').replace(uid_map).alias('user_id'),
            pl.col('movie_id').replace(mid_map).alias('movie_id')
        )        
        
        return uid_map,mid_map,data 

        
           
    def split_data(self) -> Tuple[Dataset, Dataset, Dataset]:
        """
        Split the dataset into training, validation, and test sets.

        Returns:
            Tuple[Dataset, Dataset, Dataset]: Training, validation, and test datasets.
        """
        n = len(self.data)
        train_end = int(n * (1 - self.val_ratio - self.test_ratio))
        val_end = int(n * (1 - self.test_ratio))

        data=self.data.sample(fraction=1.0,shuffle=True)  # Shuffle the data before splitting
        train_data = data[:train_end]
        val_data = data[train_end:val_end]
        test_data = data[val_end:]

        return RecommenderDataset(train_data), RecommenderDataset(val_data), RecommenderDataset(test_data)
    
    def get_dataloader(self, dataset: Dataset,batch_size:int=64,num_workers:int =4) -> DataLoader:
        """
        Get a DataLoader for the given dataset.

        Args:
            dataset (Dataset): The dataset to create a DataLoader for.

        Returns:
            DataLoader: DataLoader for the dataset.
        """
        return DataLoader(dataset, batch_size=self.batch_size, shuffle=True,num_workers=num_workers)
    
    @property
    def uid_map(self) -> Dict:
        """
        Get the user ID mapping.

        Returns:
            Dict: Mapping of user IDs to indices.
        """
        return self._uid_map
    
    @property
    def mid_map(self) -> Dict:
        """
        Get the movie ID mapping.

        Returns:
            Dict: Mapping of movie IDs to indices.
        """
        return self._mid_map