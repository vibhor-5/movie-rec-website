import axios from "axios";

const baseURL =
  (import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000") + "/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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

export interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  genre: string[];
  year: number | null;
  posterUrl: string | null;
  voteAverage: number;
  overview: string;
  releaseDate: string | null;
}

export const getMovieDetails = async (tmdbId: number): Promise<Movie> => {
  try {
    const response = await api.get(`/movie/${tmdbId}`);
    return response.data as Movie;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<Movie[]> => {
  try {
    const response = await api.get("/search", {
      params: { query, page },
    });
    return response.data as Movie[];
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMoviesByGenre = async (
  genre: string,
  page: number = 1
): Promise<Movie[]> => {
  try {
    const response = await api.get("/genre", {
      params: { genre, page },
    });
    return response.data as Movie[];
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    throw error;
  }
};

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await api.get("/popular", {
      params: { page },
    });
    return response.data as Movie[];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const getSimilarMovies = async (tmdbId: number): Promise<Movie[]> => {
  try {
    const response = await api.get("/api/similar", {
      params: { tmdbId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    throw error;
  }
};

export const saveUserPreferences = async (
  preferences: Array<{
    tmdbId: number;
    rating: number;
    seen: boolean;
  }>
): Promise<any> => {
  try {
    const response = await api.post("/user/preferences", preferences);
    return response.data;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
};
