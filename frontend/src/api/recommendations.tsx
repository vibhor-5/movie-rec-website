import axios from 'axios';

interface RecommendationResponse {
  success: boolean;
  data: {
    recommendations: Array<{
      id: number;
      tmdbId: number;
      title: string;
      genre: string[];
      year: number | null;
      posterUrl: string | null;
      voteAverage: number;
      overview: string;
      releaseDate: string | null;
      score: number;
      rank: number;
    }>;
    user_embedding: number[];
    total_count: number;
  };
}

const baseURL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export const getRecommendations = async (token: string, limit: number = 10): Promise<RecommendationResponse> => {
    try {
        const response = await api.post<RecommendationResponse>('/recommendations', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};