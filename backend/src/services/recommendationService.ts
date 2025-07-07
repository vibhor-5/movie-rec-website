import {PrismaClient} from '../generated/prisma';
import axios from 'axios';

const REC_ENG_URL= process.env.REC_ENG_URL || 'http://localhost:8000/';
const prismaClient = new PrismaClient();

const recEngApi = axios.create({
    baseURL: REC_ENG_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
interface Recommendationeresponse {
    recommendations: number[];  
    recommendation_scores: number[];
    user_embedding: number[];
}
export async function getRecommendations(userId: string, limit: number = 10) {
  try {
    const preferences = await prismaClient.userPreference.findMany({
      where: {userId},
      select: {movieId: true,
        rating: true},
      });
    if (preferences.length === 0) {
      throw new Error('No preferences found for the user');
    }
    const movie_ids = preferences.map(p => p.movieId);
    const ratings = preferences.map(p => p.rating);

    const requestBody = { movie_ids, ratings };

    console.log(`Sending to recommendation service:`, requestBody);

    // call the recommender service
    const response = await recEngApi.post(`/recommend?k=${limit}`, requestBody);
    
    // Extract user embedding from response
    const { recommendations, recommendation_scores, user_embedding } = response.data as Recommendationeresponse;
    
    // Save user embedding to database
    if (user_embedding && user_embedding.length > 0) {
      await prismaClient.user.update({
        where: { id: userId },
        data: { collab_embed: user_embedding }
      });
      console.log(`Updated user ${userId} with collaborative embedding`);
    }
    
    // Fetch movie details for recommendations
    const movieDetails = await prismaClient.movie.findMany({
      where: {
        tmdbId: { in: recommendations }
      },
      select: {
        id: true,
        tmdbId: true,
        title: true,
        genre: true,
        year: true,
        posterUrl: true,
        voteAverage: true,
        overview: true,
        releaseDate: true
      }
    });
    
    // Map recommendations with scores and preserve order
    const recommendationsWithDetails = recommendations.map((tmdbId: number, index: number) => {
      const movie = movieDetails.find(m => m.tmdbId === tmdbId);
      return {
        ...movie,
        score: recommendation_scores[index],
        rank: index + 1
      };
    }).filter(Boolean); // Remove any null entries
    
    return {
      recommendations: recommendationsWithDetails,
      user_embedding,
      total_count: recommendationsWithDetails.length
    };
    
  } catch(error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to fetch recommendations');
  }
}