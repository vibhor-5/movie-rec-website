import {PrismaClient} from '../generated/prisma';
import axios from 'axios';

const REC_ENG_URL= process.env.REC_ENG_URL || 'http://localhost:3000/';
const prismaClient = new PrismaClient();

const recEngApi = axios.create({
    baseURL: REC_ENG_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    return response.data;
}catch(error) {
    console.error('Error fetching user preferences:', error);
    throw new Error('Failed to fetch user preferences');
    }
};