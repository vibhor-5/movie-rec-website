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

export const transformMovie = (limit: (fn: () => Promise<any>) => Promise<any>) =>
    async (m: Movie): Promise<TransformedMovie> => {
        return limit(async () => {
            let imdbId: string | null = null;
            try {
                console.log("fetching imdbids")
                const imdbRes = await safeGet<ExternalIDsResponse>(
                    `/movie/${m.id}/external_ids`
                );
                imdbId = imdbRes.imdb_id || null;
            } catch (error) {
                const err = error as { response?: { data: any }; message: string };
                console.warn(
                    `Failed to fetch IMDB ID for movie ${m.id}:`,
                    err.response?.data || err.message
                );
            }

            return {
                tmdbId: m.id,
                title: m.title || m.name || null,
                genre_ids: m.genre_ids || [],
                year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
                genre: m.genres ? m.genres.map((g) => g.name) : [],
                posterUrl: m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : null,
                imdbId,
            };
        });
    };

const limitedTransform = transformMovie(limit);

export const searchMulti = async (query: string, page = 1) => {
    try {
        const res = await safeGet<{ results: TMDBResult[] }>('/search/multi', {
            params: { query, page },
        });
        const tasks = res.results.map(limitedTransform);
        const results = await Promise.all(tasks);
        return results;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error('Search error:', err.response?.data || err.message);
        throw error;
    }
};

export const getMovieDetails = async (tmdbId: number) => {
    try {
        const res = await safeGet<TMDBResult>(`/movie/${tmdbId}`);
        const m = res;
        const imdbRes = await safeGet<ExternalIDsResponse>(`/movie/${tmdbId}/external_ids`);
        return {
            tmdbId: m.id,
            title: m.title || '',
            year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
            genre: m.genres?.map((g: any) => g.name) || [],
            posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            imdbId: imdbRes.imdb_id || null,
        };
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
        console.log("transforming movies");
        const tasks = res.results.map(limitedTransform);
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
        });
        const tasks = res.results.map(limitedTransform);
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
        const tasks = res.results.map(limitedTransform);
        const result = await Promise.all(tasks);
        return result;
    } catch (error) {
        const err = error as { response?: { data: any }; message: string };
        console.error('Search error:', err.response?.data || err.message);
        throw error;
    }

}