import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
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
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
    try {
        const response = await api.get('/search', {
            params: { query, page }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

export const getMoviesByGenre = async (genre: string, page: number = 1): Promise<Movie[]> => {
    try {
        const response = await api.get('/api/genre', {
            params: { genre, page }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        throw error;
    }
};

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
    try {
        const response = await api.get('/api/popular', {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};

export const getSimilarMovies = async (tmdbId: number): Promise<Movie[]> => {
    try {
        const response = await api.get('/api/similar', {
            params: { tmdbId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        throw error;
    }
};