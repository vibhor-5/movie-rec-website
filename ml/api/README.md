# ML API Documentation

This document provides comprehensive documentation for the Machine Learning API endpoints that power the movie recommendation system.

## Base URL

```
http://localhost:8000
```

## Overview

The ML API provides two different recommendation algorithms:

1. **Matrix Factorization (MF)** - Collaborative filtering based on user-movie interactions
2. **TF-IDF** - Content-based filtering using movie metadata and tags

---

## Endpoints

### POST /recommendation

Get movie recommendations using Matrix Factorization algorithm.

**Description:** This endpoint uses a trained Matrix Factorization model to predict user preferences based on their movie ratings. The model learns latent factors for users and movies to make personalized recommendations.

**Request Body:**

```json
{
  "movie_ids": [12345, 67890, 11111],
  "ratings": [4.5, 3.0, 5.0]
}
```

**Query Parameters:**

- `k` (optional): Number of recommendations to return (default: 10, max: 50)

**Example Request:**

```bash
curl -X POST "http://localhost:8000/recommendation?k=15" \
  -H "Content-Type: application/json" \
  -d '{
    "movie_ids": [12345, 67890, 11111],
    "ratings": [4.5, 3.0, 5.0]
  }'
```

**Response (200):**

```json
{
  "recommendation_scores": [4.2, 3.8, 3.5, 3.2, 3.0],
  "recommendations": [98765, 54321, 13579, 24680, 11223],
  "skipped_tmdb_ids": [],
  "user_embedding": [0.1, 0.2, 0.3, ...]
}
```

**Response Fields:**

- `recommendation_scores`: Predicted ratings for recommended movies (0-5 scale)
- `recommendations`: TMDB IDs of recommended movies
- `skipped_tmdb_ids`: TMDB IDs that couldn't be processed (not in training data)
- `user_embedding`: Learned user representation vector (128-dimensional)

**Error Responses:**

- `400` - No valid TMDB IDs found
- `500` - Internal server error

---

### POST /tfidf-recommendation

Get movie recommendations using TF-IDF content-based filtering.

**Description:** This endpoint uses TF-IDF (Term Frequency-Inverse Document Frequency) to analyze movie metadata and tags, finding movies with similar content characteristics to those the user has rated highly.

**Request Body:**

```json
{
  "interactions": [
    [12345, 4.5],
    [67890, 3.0],
    [11111, 5.0]
  ]
}
```

**Query Parameters:**

- `k` (optional): Number of recommendations to return (default: 10, max: 50)

**Example Request:**

```bash
curl -X POST "http://localhost:8000/tfidf-recommendation?k=15" \
  -H "Content-Type: application/json" \
  -d '{
    "interactions": [
      [12345, 4.5],
      [67890, 3.0],
      [11111, 5.0]
    ]
  }'
```

**Response (200):**

```json
{
  "recommendations": [98765, 54321, 13579, 24680, 11223],
  "recommendation_scores": [0.85, 0.72, 0.68, 0.65, 0.62],
  "skipped_tmdb_ids": [],
  "algorithm": "tfidf"
}
```

**Response Fields:**

- `recommendations`: TMDB IDs of recommended movies
- `recommendation_scores`: Similarity scores (0-1 scale, higher is more similar)
- `skipped_tmdb_ids`: TMDB IDs that couldn't be processed
- `algorithm`: Always "tfidf" for this endpoint

**Error Responses:**

- `400` - No valid TMDB IDs found
- `500` - TF-IDF recommendation failed

---

### GET /health

Health check endpoint to verify API status.

**Description:** Check if the ML API is running and models are loaded correctly.

**Example Request:**

```bash
curl http://localhost:8000/health
```

**Response (200):**

```json
{
  "status": "ok"
}
```

**Response (503):**

```json
{
  "status": "error",
  "details": "Model or ID maps not ready"
}
```

---

## Algorithm Details

### Matrix Factorization (MF)

- **Type:** Collaborative Filtering
- **Model:** Neural Network-based Matrix Factorization
- **Training Data:** MovieLens 32M dataset
- **Features:**
  - 128-dimensional embeddings for users and movies
  - Dropout regularization (0.4)
  - L2 regularization (0.002)
  - Binary rating threshold (4.0+ = positive)
- **Use Case:** Best for users with sufficient rating history

### TF-IDF

- **Type:** Content-Based Filtering
- **Features:** Movie titles, genres, and user-generated tags
- **Processing:**
  - Text preprocessing and tokenization
  - TF-IDF vectorization
  - Cosine similarity for recommendations
- **Use Case:** Good for new users or when you want content-based diversity

---

## Data Requirements

### Input Validation

- Movie IDs must be valid TMDB IDs
- Ratings should be between 0.0 and 5.0
- At least one valid movie-rating pair is required
- Maximum 1000 interactions per request

### Supported Movies

- Only movies present in the MovieLens 32M dataset are supported
- TMDB IDs are mapped to internal MovieLens IDs
- Movies not in the dataset will be skipped

---

## Performance Characteristics

### Matrix Factorization

- **Latency:** ~100-200ms per request
- **Memory:** ~2GB (model + embeddings)
- **Accuracy:** Optimized for rating prediction

### TF-IDF

- **Latency:** ~50-100ms per request
- **Memory:** ~500MB (TF-IDF matrix)
- **Accuracy:** Optimized for content similarity

---

## Error Handling

### Common Error Scenarios

1. **No Valid Movies:**

```json
{
  "detail": "No valid TMDB IDs found. Missing: [12345, 67890]"
}
```

2. **Model Not Ready:**

```json
{
  "status": "error",
  "details": "Model or ID maps not ready"
}
```

3. **Invalid Input:**

```json
{
  "detail": "Invalid input format"
}
```

---

## Setup Instructions

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Ensure model files are present:

   - `model_checkpoints/mf_ml32m.pth` (Matrix Factorization model)
   - `model_checkpoints/mid_map.json` (ID mapping)
   - `data/links.csv` (TMDB-MovieLens ID mapping)

3. Start the API server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## Model Training

### Matrix Factorization Training

```bash
cd /path/to/ml
python train.py --model matrix_factorization --epochs 50
```

### TF-IDF Training

```bash
cd /path/to/ml
python models/tf_idf/train_idf.py
```

---

## Configuration

### Model Configuration (MF)

```python
mf_config = {
    "model_name": "matrix_factorization",
    "embedding_dim": 128,
    "dropout_rate": 0.4,
    "learning_rate": 0.0001,
    "batch_size": 256,
    "binarize": True,
    "min_rating": 4,
    "l2_reg": 0.002,
    "threshold": 0.5,
    "early_stopping_patience": 6
}
```

### TF-IDF Configuration

- Minimum positive rating: 3.0
- Similarity threshold: 0.1
- Maximum recommendations: 50

---

## Monitoring

### Health Checks

- Monitor `/health` endpoint for service status
- Check model loading on startup
- Verify ID mapping integrity

### Performance Metrics

- Request latency
- Success/failure rates
- Model prediction accuracy
- Memory usage

---

## Integration with Backend

The ML API is called by the backend recommendation service:

```typescript
// Backend calls ML API
const response = await fetch("http://localhost:8000/recommendation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    movie_ids: userPreferences.map((p) => p.tmdbId),
    ratings: userPreferences.map((p) => p.rating),
  }),
});
```

The backend then enriches the recommendations with movie metadata from TMDB before returning to the frontend.
