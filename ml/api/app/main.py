from fastapi import FastAPI
from utils.mf_prediction import predictor
from contextlib import asynccontextmanager
import polars as pl
from pydantic import BaseModel

class preferences(BaseModel):
    movie_ids:list[int]
    ratings:list[float]

id_dict={}
id_dict_rev={}
predictor_model=predictor()

@asynccontextmanager
async def lifespan(app:FastAPI):
    links=pl.read_csv("data/links.csv")
    id_dict.update(dict(zip(links["tmdbId"].to_list(),links["movieId"].to_list())))
    id_dict_rev.update(dict(zip(links["movieId"].to_list(),links["tmdbId"].to_list())))
    predictor_model.load_model("model_checkpoints/mf_ml32m.pth",{})
    yield
    id_dict.clear()
    id_dict_rev.clear()

app = FastAPI(lifespan=lifespan)

@app.post("/recommend")
async def recommendation(pref:preferences,k:int=10):
    movie_ids=[id_dict[x] for x in pref.movie_ids]
    recommendation_scores,recommendations=predictor_model.predict(movie_ids,pref.ratings,k)
    recommendations=[id_dict_rev[x] for x in recommendations]
    return {
    "recommendation_scores": recommendation_scores,
    "recommendations": recommendations
}



