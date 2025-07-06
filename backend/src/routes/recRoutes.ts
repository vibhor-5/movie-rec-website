import { recommendMovies } from "../controllers/recommendationController";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth";

const app = Router();

app.post('/recommendations', authenticateToken, recommendMovies);

export default app;
