import axios from "axios";

const baseURL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
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

// Save user preferences (Protected)
export const userPreferences = async (token: any, preferences: any) => {
  try {
    const response = await api.post("/user/preferences", preferences, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
};

// Get available genres
export const getAvailableGenres = async () => {
  try {
    const response = await api.get("/genres");
    return response.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

// Search movies
export const searchMovies = async (query: string) => {
  try {
    const response = await api.get("/search", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Get movies by genre
export const getGenreMovies = async (genre: string, page: number = 1) => {
  try {
    const response = await api.get("/api/genre", {
      params: { genre, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    throw error;
  }
};

// Get popular movies
export const getPopularMovies = async (page: number = 1) => {
  try {
    const response = await api.get("/api/popular", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// Get similar movies
export const getSimilarMovies = async (tmdbId: number) => {
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

// Mark onboarding as completed (Protected)
export const markOnboardingCompleted = async (token: string) => {
  try {
    const response = await api.post(
      "/user/onboarding-completed",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking onboarding as completed:", error);
    throw error;
  }
};
