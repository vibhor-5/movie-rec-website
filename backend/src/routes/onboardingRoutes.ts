import express from 'express';
import { PrismaClient } from '../generated/prisma';
import { authenticateToken } from '../middleware/auth';
import { savePreference, search, genreMovieList, getPopularList, SimilarList, markOnboardingCompleted, getAvailableGenres } from '../controllers/onboardController';
import { Request, Response } from 'express';


const app = express.Router();
const prisma = new PrismaClient();

app.post('/user/preferences', authenticateToken, savePreference);
app.post('/user/onboarding-completed', authenticateToken, markOnboardingCompleted);
app.get('/genres', getAvailableGenres);
app.get('/search', search);
app.get('/api/genre', genreMovieList); // legacy, for backward compatibility
app.get('/api/popular', getPopularList); // legacy, for backward compatibility
app.get('/api/similar', SimilarList); // legacy, for backward compatibility
// Add correct routes for /api/* endpoints
app.get('/popular', getPopularList); // so /api/popular works when mounted at /api
app.get('/genre', genreMovieList);   // so /api/genre works when mounted at /api
app.get('/similar', SimilarList);    // so /api/similar works when mounted at /api

export default app;