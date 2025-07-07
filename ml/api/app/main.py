from .utils.mf_prediction import predictor
from fastapi import FastAPI
from contextlib import asynccontextmanager
import polars as pl
from pydantic import BaseModel
import json
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from models.tf_idf.model import TFIDFModel

class preferences(BaseModel):
    movie_ids:list[int]
    ratings:list[float]

class TFIDFPreferences(BaseModel):
    interactions: list[tuple[int, float]]  # [(movie_id, rating), ...]

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
id_dict_rev={v:k for k, v in id_dict.items()}
predictor_model=predictor()
tfidf_model=TFIDFModel(
    movie_path="/Users/vibhorkumar/Desktop/projs/project/ml/data/ml-32m/movies.csv",
    tags_path="/Users/vibhorkumar/Desktop/projs/project/ml/data/ml-32m/tags.csv"
)
pos_weight=1.0

@asynccontextmanager
async def lifespan(app:FastAPI):
    predictor_model.load_model("/Users/vibhorkumar/Desktop/projs/project/ml/api/app/model_checkpoints/mf_ml32m.pth",mf_config,metadata)
    try:
        tfidf_model.load()
        print("TF-IDF model loaded successfully")
    except Exception as e:
        print(f"Warning: Could not load TF-IDF model: {e}")
        print("TF-IDF recommendations will not be available")
    yield
    id_dict.clear()
    id_dict_rev.clear()

app = FastAPI(lifespan=lifespan)
@app.post("/recommendation")
async def recommendation(pref: preferences, k: int = 10):
    valid_movie_ids = []
    valid_ratings = []
    missing_ids = []
    for x, r in zip(pref.movie_ids, pref.ratings):
        if x in id_dict:
            valid_movie_ids.append(id_dict[x])
            valid_ratings.append(r)
        else:
            missing_ids.append(x)

    if not valid_movie_ids:
        raise HTTPException(
            status_code=400,
            detail=f"No valid TMDB IDs found. Missing: {missing_ids}"
        )

    recommendation_scores, recommendations , user_emb = predictor_model.predict(valid_movie_ids, valid_ratings, k)
    recommendations = [
    id_dict_rev.get(x, f"unknown_{x}") for x in recommendations
]

    return {
        "recommendation_scores": recommendation_scores,
        "recommendations": recommendations,
        "skipped_tmdb_ids": missing_ids,
        "user_embedding": user_emb
    }

@app.post("/tfidf-recommendation")
async def tfidf_recommendation(pref: TFIDFPreferences, k: int = 10):
    try:
        # Convert TMDB IDs to internal movie IDs for TF-IDF model
        valid_interactions = []
        missing_ids = []
        
        for tmdb_id, rating in pref.interactions:
            if tmdb_id in id_dict:
                internal_id = id_dict[tmdb_id]
                valid_interactions.append((internal_id, rating))
            else:
                missing_ids.append(tmdb_id)
        
        if not valid_interactions:
            raise HTTPException(
                status_code=400,
                detail=f"No valid TMDB IDs found. Missing: {missing_ids}"
            )
        
        # Get recommendations from TF-IDF model
        recommendations, scores = tfidf_model.recommend(
            interactions=valid_interactions,
            k=k,
            min_pos_rating=3
        )
        
        # Convert back to TMDB IDs
        tmdb_recommendations = [
            id_dict_rev.get(x, f"unknown_{x}") for x in recommendations
        ]
        
        return {
            "recommendations": tmdb_recommendations,
            "recommendation_scores": scores.tolist() if hasattr(scores, 'tolist') else list(scores),
            "skipped_tmdb_ids": missing_ids,
            "algorithm": "tfidf"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TF-IDF recommendation failed: {str(e)}"
        )
@app.get("/health")
async def health_check():
    if not predictor_model or not id_dict or not id_dict_rev:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "details": "Model or ID maps not ready"}
        )
    return {"status": "ok"}