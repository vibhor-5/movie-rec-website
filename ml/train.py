from models.matrix_factorisation.trainer import MatrixFactorizationTrainer
import torch
import wandb

mf_config={
    "model_name": "matrix_factorization",
    "checkpoints_dir": "checkpoints",
    "num_epochs": 50,  # Increased for early stopping
    "embedding_dim": 128,
    "dropout_rate": 0.4,  # Reduced from 0.5
    "learning_rate": 0.0001,  # Reduced for stability
    "loss": "bce_logits",
    "data_path": "data/ml-32m/ratings.csv",
    "dataset_type": "csv",
    "separator": ',',
    "batch_size": 256,  # Increased for more stable gradients
    "binarize": True,
    "min_rating": 4,
    "wandb_project": "mf_training_fixed",
    "l2_reg": 0.002,  # Reduced regularization
    "threshold": 0.5,
    "early_stopping_patience": 6  # Early stopping patience
}


def main():
    model = MatrixFactorizationTrainer()
    model.build(mf_config)  
    model.load("checkpoints/mf_ml32m.pth")
    model.train()
    print(model.test())
    # Test prediction
    # item_ids = torch.tensor([7, 8, 9, 10])
    # ratings = torch.tensor([1.0, 1.0, 0.0, 0.0])
    
    #print(model.predict(item_ids=item_ids, ratings=ratings))

if __name__ == "__main__":
    main()