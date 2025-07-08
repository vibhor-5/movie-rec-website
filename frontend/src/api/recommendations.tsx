import axios from "axios";

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
      algorithm?: string;
    }>;
    user_embedding: number[];
    total_count: number;
    algorithm?: string;
  };
}

const baseURL =
  (import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000") + "/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increased timeout to 30 seconds
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a helper for error handling
function parseRecommendationError(error: any): { isNewUser: true } | { error: any } {
  if (error?.response?.data?.isNewUser) {
    return { isNewUser: true };
  }
  return { error };
}

export const getRecommendations = async (
  token: string,
  limit: number = 10
): Promise<RecommendationResponse | { isNewUser: true } | { error: any }> => {
  try {
    const response = await api.post<RecommendationResponse>(
      "/recommendations",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { limit },
      }
    );
    return response.data;
  } catch (error) {
    return parseRecommendationError(error);
  }
};
export const getTFIDFRecommendations = async (
  token: string,
  limit: number = 10
): Promise<RecommendationResponse> => {
  try {
    const response = await api.post<RecommendationResponse>(
      "/recommendations/tfidf",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching TF-IDF recommendations:", error);
    throw error;
  }
};
