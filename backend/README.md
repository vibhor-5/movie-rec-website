# Backend API Documentation

This document provides comprehensive documentation for all backend API endpoints.

## Base URL

```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token"
}
```

**Error Responses:**

- `400` - Validation errors
- `409` - User already exists

---

### POST /api/auth/login

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token"
}
```

**Error Responses:**

- `400` - Validation errors
- `401` - Invalid credentials

---

### GET /api/auth/profile

Get current user profile (Protected).

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### PUT /api/auth/profile

Update user profile (Protected).

**Request Body:**

```json
{
  "name": "John Smith"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user-id",
    "name": "John Smith",
    "email": "john@example.com"
  }
}
```

---

### PUT /api/auth/change-password

Change user password (Protected).

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Onboarding Endpoints

### POST /user/preferences

Save user movie preferences during onboarding (Protected).

**Request Body:**

```json
[
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
]
```

**Response (200):**

```json
{
  "message": "Processed 2 preferences",
  "successful": 2,
  "failed": 0,
  "successfulPreferences": [
    {
      "tmdbId": 12345,
      "movieId": "movie-db-id",
      "rating": 4.5,
      "seen": true
    }
  ]
}
```

---

### POST /user/onboarding-completed

Mark user onboarding as completed (Protected).

**Response (200):**

```json
{
  "success": true,
  "message": "Onboarding completed successfully"
}
```

---

### GET /genres

Get available movie genres.

**Response (200):**

```json
[
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  }
]
```

---

### GET /search

Search for movies by title.

**Query Parameters:**

- `query` (required): Search term

**Example:**

```
GET /search?query=batman
```

**Response (200):**

```json
{
  "page": 1,
  "results": [
    {
      "id": 268,
      "title": "Batman",
      "overview": "When the menace known as the Joker wreaks havoc...",
      "poster_path": "/kBf3g9crrADGMc2AMAMlLBgSm2h.jpg",
      "release_date": "1989-06-23",
      "vote_average": 7.2
    }
  ],
  "total_pages": 10,
  "total_results": 200
}
```

---

### GET /api/genre

Get movies by genre.

**Query Parameters:**

- `genre` (required): Genre name in Sentence case (e.g., "Action", "Comedy")

**Example:**

```
GET /api/genre?genre=Action
```

**Response (200):**

```json
{
  "page": 1,
  "results": [
    {
      "id": 12345,
      "title": "Movie Title",
      "overview": "Movie description...",
      "poster_path": "/poster.jpg",
      "release_date": "2023-01-01",
      "vote_average": 7.5
    }
  ],
  "total_pages": 5,
  "total_results": 100
}
```

---

### GET /api/popular

Get popular movies.

**Query Parameters:**

- `page` (optional): Page number (default: 1)

**Example:**

```
GET /api/popular?page=1
```

**Response (200):**

```json
{
  "page": 1,
  "results": [
    {
      "id": 12345,
      "title": "Popular Movie",
      "overview": "Movie description...",
      "poster_path": "/poster.jpg",
      "release_date": "2023-01-01",
      "vote_average": 8.0
    }
  ],
  "total_pages": 20,
  "total_results": 400
}
```

---

### GET /api/similar

Get similar movies based on TMDB ID.

**Query Parameters:**

- `tmdbId` (required): TMDB movie ID

**Example:**

```
GET /api/similar?tmdbId=12345
```

**Response (200):**

```json
{
  "page": 1,
  "results": [
    {
      "id": 67890,
      "title": "Similar Movie",
      "overview": "Movie description...",
      "poster_path": "/poster.jpg",
      "release_date": "2023-01-01",
      "vote_average": 7.0
    }
  ],
  "total_pages": 1,
  "total_results": 20
}
```

---

## Recommendation Endpoints

### POST /api/recommendations

Get movie recommendations using Matrix Factorization (Protected).

**Query Parameters:**

- `limit` (optional): Number of recommendations (default: 10)

**Example:**

```
POST /api/recommendations?limit=15
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "tmdbId": 12345,
        "title": "Recommended Movie",
        "overview": "Movie description...",
        "poster_path": "/poster.jpg",
        "release_date": "2023-01-01",
        "vote_average": 7.5,
        "predicted_rating": 4.2
      }
    ],
    "algorithm": "matrix_factorization"
  }
}
```

**Error Responses:**

- `404` - No preferences found
- `500` - Internal server error

---

### POST /api/recommendations/tfidf

Get movie recommendations using TF-IDF algorithm (Protected).

**Query Parameters:**

- `limit` (optional): Number of recommendations (default: 10)

**Example:**

```
POST /api/recommendations/tfidf?limit=15
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "tmdbId": 12345,
        "title": "Recommended Movie",
        "overview": "Movie description...",
        "poster_path": "/poster.jpg",
        "release_date": "2023-01-01",
        "vote_average": 7.5,
        "similarity_score": 0.85
      }
    ],
    "algorithm": "tfidf"
  }
}
```

**Error Responses:**

- `404` - No preferences found
- `500` - Internal server error

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation failed",
  "errors": ["Field is required", "Invalid format"]
}
```

### 401 Unauthorized

```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "details": "Error description"
}
```

---

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
}
```

### Movie

```typescript
interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: Genre[];
}
```

### UserPreference

```typescript
interface UserPreference {
  userId: string;
  movieId: string;
  rating: number;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Genre

```typescript
interface Genre {
  id: number;
  name: string;
}
```

---

## Environment Variables

Required environment variables:

```env
PORT=3000
JWT_SECRET=your-jwt-secret
TMDB_API_KEY=your-tmdb-api-key
DATABASE_URL=your-database-url
```

---

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env` file

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Start the server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`
