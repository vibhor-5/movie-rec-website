from .utils.mf_prediction import predictor
from fastapi import FastAPI
from contextlib import asynccontextmanager
import polars as pl
from pydantic import BaseModel
import json
from fastapi.responses import JSONResponse

class preferences(BaseModel):
    movie_ids:list[int]
    ratings:list[float]

mf_config={
    "model_name": "matrix_factorization",
    "embedding_dim": 128,
    "dropout_rate": 0.4,  
    "learning_rate": 0.0001, 
    "data_path": "/Users/vibhorkumar/Desktop/projs/project/ml/data/ml-32m/ratings.csv",
    "dataset_type": "csv",
    "separator": ',',
    "batch_size": 256,  
    "binarize": True,
    "min_rating": 4,
    "l2_reg": 0.002,  
    "threshold": 0.5,
    "early_stopping_patience": 6  
}
with open("/Users/vibhorkumar/Desktop/projs/project/ml/api/app/model_checkpoints/mid_map.json", "r") as f:
        metadata=json.load(f)
links=pl.read_csv("/Users/vibhorkumar/Desktop/projs/project/ml/api/app/data/links.csv")
id_dict=dict(zip(links["tmdbId"].to_list(),links["movieId"].to_list()))
id_dict_rev=dict(zip(links["movieId"].to_list(),links["tmdbId"].to_list()))
predictor_model=predictor()
pos_weight=1.0

@asynccontextmanager
async def lifespan(app:FastAPI):
    predictor_model.load_model("/Users/vibhorkumar/Desktop/projs/project/ml/api/app/model_checkpoints/mf_ml32m.pth",mf_config,metadata)
    yield
    id_dict.clear()
    id_dict_rev.clear()

app = FastAPI(lifespan=lifespan)

@app.post("/recommend")
async def recommendation(pref:preferences,k:int=10):
    movie_ids=[id_dict[x] for x in pref.movie_ids]
    recommendation_scores,recommendations,user_embedding=predictor_model.predict(movie_ids,pref.ratings,k)
    recommendations=[id_dict_rev[x] for x in recommendations]
    return {
    "recommendation_scores": recommendation_scores,
    "recommendations": recommendations,
    "user_embedding": user_embedding
}

@app.get("/health")
async def health_check():
    if not predictor_model or not id_dict or not id_dict_rev:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "details": "Model or ID maps not ready"}
        )
    return {"status": "ok"}