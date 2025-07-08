import {PrismaClient} from '../generated/prisma';
import axios from 'axios';
import { getMovieDetails } from '../utils/tmdb';

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
      select: {movieId: true, rating: true},
    });
    if (preferences.length === 0) {
      // Instead of throwing, return a cold start response
      return {
        recommendations: [],
        user_embedding: [],
        total_count: 0,
        isNewUser: true
      };
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
    
    // Map recommendations with scores and preserve order, fetching from TMDB if not in DB
    const recommendationsWithDetails = await Promise.all(recommendations.map(async (tmdbId: number, index: number) => {
      let movie = movieDetails.find(m => m.tmdbId === tmdbId);
      if (!movie) {
        try {
          const tmdbMovie = await getMovieDetails(tmdbId);
          movie = { ...tmdbMovie, tmdbId, id: 0 };
        } catch (err) {
          console.error(`Failed to fetch movie details from TMDB for tmdbId ${tmdbId}:`, err);
          return null;
        }
      }
      return {
        ...movie,
        score: recommendation_scores[index],
        rank: index + 1
      };
    }));
    const filteredRecommendations = recommendationsWithDetails.filter(Boolean);
    
    return {
      recommendations: filteredRecommendations,
      user_embedding,
      total_count: filteredRecommendations.length
    };
    
  } catch(error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to fetch recommendations');
  }
}

export async function getTFIDFRecommendations(userId: string, limit: number = 10) { 
  try {
    // Fetch user preferences
    const preferences = await prismaClient.userPreference.findMany({
      where: { userId },
      select: { movieId: true, rating: true },
    });
    if (preferences.length === 0) {
      throw new Error('No preferences found for the user');
    }
    // Prepare interactions as array of [movieId, rating]
    const interactions = preferences.map(p => [p.movieId, p.rating]);
    const requestBody = { interactions };

    // Call the TF-IDF recommender service
    const response = await recEngApi.post(`/tfidf-recommendation?k=${limit}`, requestBody);
    const { recommendations, recommendation_scores } = response.data as { recommendations: number[]; recommendation_scores: number[] };

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

    // Map recommendations with scores and preserve order, fetching from TMDB if not in DB
    const recommendationsWithDetails = await Promise.all(recommendations.map(async (tmdbId: number, index: number) => {
      let movie = movieDetails.find(m => m.tmdbId === tmdbId);
      if (!movie) {
        try {
          const tmdbMovie = await getMovieDetails(tmdbId);
          movie = { ...tmdbMovie, tmdbId, id: 0 };
        } catch (err) {
          console.error(`Failed to fetch movie details from TMDB for tmdbId ${tmdbId}:`, err);
          return null;
        }
      }
      return {
        ...movie,
        score: recommendation_scores[index],
        rank: index + 1
      };
    }));
    const filteredRecommendations = recommendationsWithDetails.filter(Boolean);

    return {
      recommendations: filteredRecommendations,
      total_count: filteredRecommendations.length
    };
  } catch (error) {
    console.error('Error fetching TF-IDF recommendations:', error);
    throw new Error('Failed to fetch TF-IDF recommendations');
  }
}