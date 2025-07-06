import axios from 'axios';
import { TMDBResult, ExternalIDsResponse, Movie, TransformedMovie } from '../types/tmdb';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
// Limit concurrency to 5 simultaneous requests
const limit = pLimit(2);
dotenv.config();

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Validate Bearer token on startup
if (!TMDB_BEARER_TOKEN) {
    console.error('ERROR: TMDB_BEARER_TOKEN not found in environment variables');
    console.error('Please add TMDB_BEARER_TOKEN to your .env file');
    process.exit(1);
}

// Create axios instance with Bearer token authentication
const tmdbApi = axios.create({
    baseURL: TMDB_BASE,
    headers: {
        Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

export async function safeGet<T>(url: string, options = {}, retries = 3): Promise<T> {
    while (retries > 0) {
        try {
            const res = await tmdbApi.get<T>(url, options);
            return res.data;
        } catch (err: any) {
            if (err.code === 'ECONNRESET') {
                console.warn('ECONNRESET, retrying...');
                retries--;
                await new Promise(res => setTimeout(res, 500));
            } else {
                throw err;
            }
        }
    }
    throw new Error('Max retries exceeded (ECONNRESET)');
}

export const transformMovie = async (m: TMDBResult) => {
            return {
                tmdbId: m.id,
                title: m.title || m.name || 'Unknown Title',
                genre: m.genres ? m.genres.map((g) => g.name) : [],
                year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
                releaseDate: new Date(m.release_date as any) || '',
                posterUrl: m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : null,
                overview: m.overview || '',
                voteAverage: m.vote_average || 0,
            };
    }

export const searchMovie = async (query: string, page = 1) => {
    try {
        const res = await safeGet<{ results: TMDBResult[] }>('/search/movie', {
            params: { query, page },
        });
        const tasks = res.results.map(transformMovie);
        const results = await Promise.all(tasks);
        return results;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error('Search error:', err.response?.data || err.message);
        throw error;
    }
};

export const getMovieDetails = async (tmdbId: number): Promise<TransformedMovie> => {
    try {
        const res = await safeGet<TMDBResult>(`/movie/${tmdbId}`);
        const m = res;
        if (!m) {
            throw new Error(`Movie with TMDB ID ${tmdbId} not found`);
        }
        const result = await transformMovie(m);
        return result;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error(`Failed to get movie details for TMDB ID ${tmdbId}:`, err.response?.data || err.message);
        throw error;
    }
};

export const getGenreMovies = async (genre: String, page = 1) => {
    try {
        const res = await safeGet<{ results: TMDBResult[] }>(`discover/movie`, {
            params: {
                with_genres: genre,
                page
            }
        });
        const tasks = res.results.map(transformMovie);
        const results = await Promise.all(tasks);
        return results;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error('Search error:', err.response?.data || err.message);
        throw error;
    }
};

export const getPopularMovies = async (page: number) => {
    try {
        const res = await safeGet<{ results: TMDBResult[] }>(`discover/movie`, {
            params: {
                page,
            }
        });// This transformation should only include the direct mapping of fields available in the popular movies endpoint, without fetching external IDs.
        const tasks = res.results.map(transformMovie);
        const results = await Promise.all(tasks);
        return results;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error('Search error:', err.response?.data || err.message);
        throw error;
    }
}

export const getSimilar = async (tmdbid: number) => {
    try {
        const res = await safeGet<{ results: TMDBResult[] }>(`/movie/${tmdbid}/similar`);
        if (!res.results) {
            console.error("TMDb response missing 'results':", res);
            return [];
        }
        const tasks = res.results.map(transformMovie);
        const result = await Promise.all(tasks);
        return result;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error('Search error:', err.response?.data || err.message);
        throw error;
    }

}