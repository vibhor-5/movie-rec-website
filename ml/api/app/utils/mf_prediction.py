import torch 
from models.matrix_factorisation.trainer import MatrixFactorizationTrainer

class predictor:

    def load_model(self,path:str,config,metadata:dict):
        self.trainer=MatrixFactorizationTrainer()
        config.update({"num_users":metadata.get("num_users", 0),
                       "num_items":metadata.get("num_items", 0)})
        self.trainer.build_for_inference(config)
        self.trainer.load(path)
        self.mid_map=metadata.get("mid_map", {})
        self.pos_weight=metadata.get("pos_weight", 1.0)
        return self.trainer.model
    
    def predict(self,movie_ids,ratings,k):
        movie_ids=[self.mid_map[x] for x in movie_ids]
        movie_ids = torch.tensor(movie_ids, dtype=torch.long)
        ratings = torch.tensor(ratings, dtype=torch.float32)
        recommendation_scores,recommendations=self.trainer.predict(movie_ids,ratings,k,self.pos_weight)
        return recommendation_scores.tolist(),recommendations.tolist()


