from models.matrix_factorisation.trainer import MatrixFactorizationTrainer
import torch
import wandb

mf_config={
    "model_name": "matrix_factorization",
    "checkpoints_dir": "checkpoints",
    "num_epochs": 10,
    "embedding_dim": 64,
    "dropout_rate": 0.5,
    "learning_rate": 0.0005,
    "loss": "bce_logits",
    "data_path": "ml-1m/ratings.dat",
    "dataset_type": "csv",
    "separator": ',',
    "batch_size": 128,  # Increased batch size
    "binarize": True,
    "min_rating": 4,
    "wandb_project": "mf_training",
    "l2_reg": 0.001,  # Reduced regularization
    "threshold": 0.5  # Explicit threshold
}


def main():
    model = MatrixFactorizationTrainer()
    model.build(mf_config)  
    model.train()
    
    # Test prediction
    item_ids = torch.tensor([7, 8, 9, 10])
    ratings = torch.tensor([1.0, 1.0, 0.0, 0.0])
    
    print(model.predict(item_ids=item_ids, ratings=ratings))

if __name__ == "__main__":
    main()