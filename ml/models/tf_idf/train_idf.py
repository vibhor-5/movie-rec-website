from model import TFIDFModel


def main():
    movie_path = "data/ml-32m/movies.csv"
    tags_path = "data/ml-32m/tags.csv"

    model = TFIDFModel(movie_path=movie_path, tags_path=tags_path)
    model.fit()
    model.build_faiss_index()

    # Example search
    movie_id = 1  # Replace with a valid movie ID
    result = model.search(movie_id)
    if not result:
        print("sucessfully searched")

if __name__ == "__main__":
    main()