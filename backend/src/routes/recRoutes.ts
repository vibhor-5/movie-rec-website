import { recommendMovies, recommendMoviesTFIDF } from "../controllers/recommendationController";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth";

const app = Router();

app.post('/recommendations', authenticateToken, recommendMovies);
app.post('/recommendations/tfidf', authenticateToken, recommendMoviesTFIDF);

export default app;
