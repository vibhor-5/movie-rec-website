# Complete API Documentation

This document provides comprehensive documentation for the entire movie recommendation system, including both the Backend API and ML API.

## System Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │    ML API   │
│  (React)    │◄──►│  (Node.js)  │◄──►│  (FastAPI)  │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Database   │
                   │  (Prisma)   │
                   └─────────────┘
```

## Quick Start

### Backend API

- **URL:** `http://localhost:3000`
- **Documentation:** `backend/README.md`
- **Start:** `cd backend && npm run dev`

### ML API

- **URL:** `http://localhost:8000`
- **Documentation:** `ml/api/README.md`
- **Interactive Docs:** `http://localhost:8000/docs`
- **Start:** `cd ml/api && uvicorn app.main:app --host 0.0.0.0 --port 8000`

---

## Backend API Endpoints

### Authentication

| Method | Endpoint                    | Description       | Auth Required |
| ------ | --------------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user | No            |
| POST   | `/api/auth/login`           | User login        | No            |
| GET    | `/api/auth/profile`         | Get user profile  | Yes           |
| PUT    | `/api/auth/profile`         | Update profile    | Yes           |
| PUT    | `/api/auth/change-password` | Change password   | Yes           |

### Onboarding

| Method | Endpoint                     | Description              | Auth Required |
| ------ | ---------------------------- | ------------------------ | ------------- |
| POST   | `/user/preferences`          | Save movie preferences   | Yes           |
| POST   | `/user/onboarding-completed` | Mark onboarding complete | Yes           |
| GET    | `/genres`                    | Get available genres     | No            |
| GET    | `/search`                    | Search movies            | No            |
| GET    | `/api/genre`                 | Get movies by genre      | No            |
| GET    | `/api/popular`               | Get popular movies       | No            |
| GET    | `/api/similar`               | Get similar movies       | No            |

### Recommendations

| Method | Endpoint                     | Description               | Auth Required |
| ------ | ---------------------------- | ------------------------- | ------------- |
| POST   | `/api/recommendations`       | Matrix Factorization recs | Yes           |
| POST   | `/api/recommendations/tfidf` | TF-IDF recommendations    | Yes           |

---

## ML API Endpoints

| Method | Endpoint                | Description          | Auth Required |
| ------ | ----------------------- | -------------------- | ------------- |
| POST   | `/recommendation`       | Matrix Factorization | No            |
| POST   | `/tfidf-recommendation` | TF-IDF Content-based | No            |
| GET    | `/health`               | Health check         | No            |

---

## Integration Examples

### Complete User Flow

#### 1. User Registration

```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 2. User Login

```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 3. Get Available Genres

```bash
curl "http://localhost:3000/genres"
```

#### 4. Get Movies by Genre

```bash
curl "http://localhost:3000/api/genre?genre=Action"
```

#### 5. Save User Preferences

```bash
curl -X POST "http://localhost:3000/user/preferences" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "tmdbId": 12345,
      "rating": 4.5,
      "seen": true
    },
    {
      "tmdbId": 67890,
      "rating": 3.0,
      "seen": false
    }
  ]'
```

#### 6. Mark Onboarding Complete

```bash
curl -X POST "http://localhost:3000/user/onboarding-completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 7. Get Recommendations

```bash
curl -X POST "http://localhost:3000/api/recommendations?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Direct ML API Usage

#### Matrix Factorization Recommendations

```bash
curl -X POST "http://localhost:8000/recommendation?k=15" \
  -H "Content-Type: application/json" \
  -d '{
    "movie_ids": [12345, 67890, 11111],
    "ratings": [4.5, 3.0, 5.0]
  }'
```

#### TF-IDF Recommendations

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

---

## Data Flow

### Recommendation Process

1. **Frontend** → **Backend**: User requests recommendations
2. **Backend** → **Database**: Fetch user preferences
3. **Backend** → **ML API**: Send preferences for processing
4. **ML API**: Generate recommendations using algorithms
5. **ML API** → **Backend**: Return movie IDs and scores
6. **Backend** → **TMDB API**: Fetch movie metadata
7. **Backend** → **Frontend**: Return enriched recommendations

### Onboarding Process

1. **Frontend** → **Backend**: Get available genres
2. **Backend** → **TMDB API**: Fetch genre movies
3. **Frontend** → **Backend**: Save user preferences
4. **Backend** → **Database**: Store preferences
5. **Frontend** → **Backend**: Mark onboarding complete

---

## Error Handling

### Common Error Codes

| Code | Description    | Example                   |
| ---- | -------------- | ------------------------- |
| 400  | Bad Request    | Invalid input format      |
| 401  | Unauthorized   | Missing/invalid JWT token |
| 404  | Not Found      | User/movie not found      |
| 409  | Conflict       | User already exists       |
| 500  | Internal Error | Server/ML model error     |

### Error Response Format

```json
{
  "error": "Error description",
  "details": "Additional error information",
  "code": "ERROR_CODE"
}
```

---

## Authentication

### JWT Token Format

```json
{
  "id": "user-id",
  "userId": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Usage

```bash
# Include in Authorization header
Authorization: Bearer <jwt-token>

# Example
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:3000/api/auth/profile"
```

---

## Database Schema

### Users

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  onboardingCompleted BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Movies

```sql
CREATE TABLE movies (
  id VARCHAR PRIMARY KEY,
  tmdbId INTEGER UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  overview TEXT,
  posterPath VARCHAR,
  releaseDate DATE,
  voteAverage DECIMAL(3,1),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### UserPreferences

```sql
CREATE TABLE userPreferences (
  userId VARCHAR REFERENCES users(id),
  movieId VARCHAR REFERENCES movies(tmdbId),
  rating DECIMAL(2,1),
  seen BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (userId, movieId)
);
```

---

## Environment Variables

### Backend (.env)

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
TMDB_API_KEY=your-tmdb-api-key
DATABASE_URL=postgresql://user:password@localhost:5432/moviedb
```

### ML API (.env)

```env
MODEL_PATH=/path/to/model/checkpoints
DATA_PATH=/path/to/ml/data
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.8+
- PostgreSQL
- TMDB API Key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npm run dev
```

### ML API Setup

```bash
cd ml/api
pip install -r requirements.txt
# Ensure model files are present
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Testing

### Backend API Tests

```bash
cd backend
npm test
```

### ML API Health Check

```bash
curl http://localhost:8000/health
```

### End-to-End Test

```bash
# 1. Start all services
# 2. Register user
# 3. Complete onboarding
# 4. Get recommendations
# 5. Verify response format
```

---

## Monitoring

### Health Checks

- Backend: `GET /api/health` (if implemented)
- ML API: `GET /health`
- Database: Connection pool status

### Performance Metrics

- Request latency
- Success/failure rates
- Model prediction accuracy
- Memory usage

### Logging

- Backend: Console logs with timestamps
- ML API: FastAPI access logs
- Database: Query performance logs

---

## Deployment

### Production Considerations

- Use environment-specific configurations
- Implement proper CORS settings
- Set up SSL/TLS certificates
- Configure database connection pooling
- Implement rate limiting
- Set up monitoring and alerting

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```dockerfile
# ML API Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Support

For issues and questions:

1. Check the individual README files in `backend/` and `ml/api/`
2. Review the interactive API documentation at `http://localhost:8000/docs`
3. Check server logs for detailed error information
4. Verify environment variables are correctly set
