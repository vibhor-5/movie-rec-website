import { getRecommendations, getTFIDFRecommendations } from "../services/recommendationService";
import { Request, Response } from "express";

export async function recommendMovies(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;
    console.log('User ID:', userId);
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getRecommendations(userId, limit);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    if (error instanceof Error && error.message === 'No preferences found for the user') {
      res.status(404).json({ 
        success: false,
        error: 'No preferences found. Please rate some movies first.',
        code: 'NO_PREFERENCES'
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
export async function recommendMoviesTFIDF(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;
    console.log('User ID for TF-IDF:', userId);
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getTFIDFRecommendations(userId, limit);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching TF-IDF recommendations:', error);
    
    if (error instanceof Error && error.message === 'No preferences found for the user') {
      res.status(404).json({ 
        success: false,
        error: 'No preferences found. Please rate some movies first.',
        code: 'NO_PREFERENCES'
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch TF-IDF recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}