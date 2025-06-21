from models.matrix_factorisation.trainer import MatrixFactorizationTrainer
import torch

mf_config={
    "model_name": "matrix_factorization",
    "checkpoints_dir": "checkpoints",
    "num_epochs": 20,
    "embedding_dim": 64,
    "learning_rate": 0.005,
    "loss": "bce_logits",
    "data_path": "ml-1m/ratings.dat",  # Replace with actual data path
    "dataset_type": "csv",
    "separator": ',',
    "batch_size": 64,
    "binarize": True,
    "min_rating": 4,
    "wandb_project": "mf_training",
    "l2_reg": 0.001
}


def main():
    model = MatrixFactorizationTrainer()
    model.build(mf_config)  
    model.train()
    
    # model.load("/Users/vibhorkumar/Desktop/projs/project/ml/checkpoints/matrix_factorisation/matrix_factorization_model_epoch_20_20250619_144657.pth")
    item_ids= torch.tensor([7,8,9,10])
    ratings= torch.tensor([1.0,1.0,0.0,0.0])  # Example item IDs
    
    print(model.predict(item_ids=item_ids,ratings=ratings))

if __name__ == "__main__":
    main()