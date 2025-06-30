import polars as pl
import numpy as np
from typing import Dict, Tuple
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
import faiss
import joblib
import os

class TFIDFModel:
    def __init__(self, movie_path:str , tags_path: str ,save_path: str = "checkpoints/tf_idf",svd_components:int =1000):
        
        self.movies= pl.scan_csv(movie_path, separator=",", has_header=True,new_columns=["movie_id", "title", "genres"])
        self.tags = pl.scan_csv(tags_path, separator=",", has_header=True, new_columns=["user_id", "movie_id", "tag", "timestamp"])
        self.tags= self.process_data(self.movies,self.tags)
        self.save_path= save_path
        self.svd_components= svd_components

    def process_data(self, movies: pl.DataFrame, tags: pl.DataFrame) -> pl.DataFrame:
        
        tags = tags.group_by("movie_id").agg(
            pl.col("tag").str.join(",").alias("tags")
        ).select(
            pl.col("movie_id"),
            pl.col("tags")
        )
        movies = movies.join(tags, on="movie_id", how="left")
        movies= movies.select(
            pl.col("movie_id"),
            pl.col("title"),
            pl.when(pl.col("tags").is_not_null())
            .then(
                pl.col("genres") + "," + pl.col("tags")
            )
            .otherwise(pl.col("genres"))
            .alias("tags")
        )

        return movies

    
    def fit(self) -> None:
        self.tfidf_vectorizer = TfidfVectorizer(
            min_df=3,
            max_df=0.8,
            ngram_range=(1, 3),
            stop_words='english',
            sublinear_tf=True,
        )
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(
            self.tags.select("tags").collect().to_series().to_list()
            )
        self.movie_ids = self.tags.collect()["movie_id"].to_list()
        
        print(f"TF-IDF matrix shape: {tfidf_matrix.shape}")
        print(f"Matrix sparsity: {1 - tfidf_matrix.nnz / (tfidf_matrix.shape[0] * tfidf_matrix.shape[1]):.4f}")
        print(f"Applying TruncatedSVD with {self.svd_components} components...")
        self.svd = TruncatedSVD(n_components=self.svd_components, random_state=42)
        self.tfidf_matrix = self.svd.fit_transform(tfidf_matrix)
        self.tfidf_matrix = normalize(self.tfidf_matrix, norm='l2')

        print(f"Reduced matrix shape: {self.tfidf_matrix.shape}")
        print(f"Explained variance ratio: {self.svd.explained_variance_ratio_.sum():.4f}")
        print(f"Storage reduction: {tfidf_matrix.shape[1] / self.svd_components:.0f}x")

    def build_faiss_index(self) -> None:
        d= self.tfidf_matrix.shape[1]
        tfidf_dense = self.tfidf_matrix.astype(np.float32)
        self.index= faiss.IndexFlatIP(d)
        self.index.add(tfidf_dense)
        print(f"FAISS index built with {self.index.ntotal} vectors.")
        self.save()

    def search(self, movie_id:int) :
        movie_idx= self.movie_ids.index(movie_id)
        if hasattr(self.tfidf_matrix, 'toarray'):
            return self.tfidf_matrix[movie_idx].toarray().flatten().astype(np.float32)
        else:
            return self.tfidf_matrix[movie_idx].astype(np.float32)

    def recommend(self, interactions: list[Tuple], k: int = 10, min_pos_rating:int=3):
        ratings= [x[1] for x in interactions]
        movie_ids= [x[0] for x in interactions]
        rating_weights= [max(0,x-2.5)/2.5 if x>min_pos_rating else 0 for x in ratings]
        movie_vectors= [self.search(movie_id) for movie_id in movie_ids]
        user_vector= np.average(movie_vectors, axis=0, weights=rating_weights)
        user_vector = user_vector.reshape(1, -1).astype(np.float32)
        expect_val, indices = self.index.search(user_vector, k)
        recommendations= [self.movie_ids[i] for i in indices[0]]
        return recommendations, expect_val[0]

    def save(self) -> None:
        import os
        os.makedirs(self.save_path, exist_ok=True)
        
        # Save all components
        joblib.dump(self.tfidf_vectorizer, f"{self.save_path}/tfidf_vectorizer.pkl")
        joblib.dump(self.svd, f"{self.save_path}/svd_transformer.pkl")
        joblib.dump(self.index, f"{self.save_path}/faiss_index.pkl")
        joblib.dump(self.movie_ids, f"{self.save_path}/movie_ids.pkl")
        
        print(f"Model saved to {self.save_path}")
        
    def load(self) -> None:
        """Load a pre-trained model"""
        self.tfidf_vectorizer = joblib.load(f"{self.save_path}/tfidf_vectorizer.pkl")
        self.svd = joblib.load(f"{self.save_path}/svd_transformer.pkl")
        self.index = joblib.load(f"{self.save_path}/faiss_index.pkl")
        self.movie_ids = joblib.load(f"{self.save_path}/movie_ids.pkl")
        print(f"Model loaded from {self.save_path}")