from models.matrix_factorisation.trainer import MatrixFactorizationTrainer


mf_config={
    "model_name": "matrix_factorization",
    "checkpoints_dir": "checkpoints",
    "num_epochs": 20,
    "embedding_dim": 64,
    "learning_rate": 0.001,
    "loss": "mse",
    "data_path": "ml-1m/ratings.dat",  # Replace with actual data path
    "dataset_type": "csv",
    "separator": ',',
    "batch_size": 64,
    "binarize": True,
    "min_rating": 4,
    "wandb_project": "mf_training"
}


def main():
    model = MatrixFactorizationTrainer()
    model.build(mf_config)
    model.load("./checkpoints/matrix_factorization_model.pth")  
    # model.train()
    print(model.test())

if __name__ == "__main__":
    main()