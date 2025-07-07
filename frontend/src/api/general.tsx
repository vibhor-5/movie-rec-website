import axios from 'axios';

interface Movie {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string;
  genre: string[];
  overview: string;
  voteAverage: number;
  year: number | null;
}


const baseURL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';
const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const searchMovies = async (query:any) => {  
    try {
        const response = await api.get('/search', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}

export const getGenreList = async (genre:any) => {
    try {
        const response = await api.get('/api/genre',{
            params: { genre }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching genre list:', error);
        throw error;
    }
}

export const getPopularMovies = async (page:number): Promise<Movie[]> =>  {
    try {
        const response = await api.get<Movie[]>('/api/popular', {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
}