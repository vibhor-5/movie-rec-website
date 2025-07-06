import { getRecommendations } from "../services/recommendationService";
import { Request, Response } from "express";

export async function recommendMovies(req: Request, res: Response) {
  const userId = (req as any).user.userId; // Assuming user ID is stored in req.user
  console.log('User ID:', userId);
  const limit = parseInt(req.query.limit as string) || 10; // Default limit to 10 if not provided

  try {
    const recommendations = await getRecommendations(userId, limit);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}