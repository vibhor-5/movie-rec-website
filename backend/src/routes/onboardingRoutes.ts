import express from 'express';
import { PrismaClient } from '../generated/prisma';
import { authenticateToken } from '../middleware/auth';
import { savePreference, searchAny, genreMovieList, getPopularList, SimilarList } from '../controllers/onboardController';
import { Request, Response } from 'express';
import { searchMulti } from '../utils/tmdb';

const app = express.Router();
const prisma = new PrismaClient();

app.post('/user/preferences', authenticateToken, savePreference);
app.get('/search', searchAny);
app.get('/api/genre', genreMovieList); //send the genre in sentencecase
app.get('/api/popular', getPopularList);//send page number
app.get('/api/similar', SimilarList);//send tmdbId














// app.get('/test-tmdb', async (req: Request, res: Response) => {
//     try {
//         const testResult = await searchMulti('batman', 1);
//         res.json({
//             success: true,
//             message: 'TMDB connection working',
//             sampleResult: testResult.slice(0, 2) // Just show first 2 results
//         });
//     } catch (error) {
//         const err = error as { message: string; response?: { data: any } };
//         res.status(500).json({
//             success: false,
//             error: err.message,
//             details: err.response?.data || 'No additional details'
//         });
//     }
// });
export default app;