import axios from 'axios';

const baseURL = process.env.BACKEND_API_URL || 'http://localhost:5000/';
const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const searchMovies = async (query) => {  
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

export const getGenreList = async (genre) => {
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

export const getPopularMovies = async (page = 1) => {
    try {
        const response = await api.get('/api/popular', {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
}

