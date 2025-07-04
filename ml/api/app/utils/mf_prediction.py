import torch 
from models import MatrixFactorizationTrainer

class predictor:

    def load_model(self,path:str,config):
        self.trainer=MatrixFactorizationTrainer()
        self.trainer.build(config,trainable=False)
        self.mid_map=self.trainer.mid_map
        self.trainer.load(path)
        return self.trainer.model
    
    def predict(self,movie_ids,ratings,k):
        movie_ids=[self.mid_map[x] for x in movie_ids]
        movie_ids = torch.tensor(movie_ids, dtype=torch.long)
        ratings = torch.tensor(ratings, dtype=torch.float32)
        recommendation_scores,recommendations=self.trainer.predict(movie_ids,ratings,k)
        return recommendation_scores.tolist(),recommendations.tolist()


