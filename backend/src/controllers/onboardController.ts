import { Request, Response } from 'express';
import { getMovieDetails, searchMulti, getGenreMovies, getPopularMovies, getSimilar } from '../utils/tmdb';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const savePreference = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as Request & { user: { id: string } }).user.id;
        const preferences = req.body; // [{ tmdbId, rating, seen, imdbid }]
        if (!Array.isArray(preferences)) {
            res.status(400).json({ error: 'Preferences must be an array' });
            return;
        }
        for (const pref of preferences) {
            if (!pref.tmdbId) {
                console.warn('Skipping preference without tmdbId:', pref);
                continue;
            }

            let movie = await prisma.movie.findUnique({ where: { tmdbId: pref.tmdbId } });

            // Cache if not present
            if (!movie) {
                try {
                    const data = await getMovieDetails(pref.tmdbId);
                    movie = await prisma.movie.create({ data });
                } catch (error) {
                    console.error(`Failed to fetch movie details for ${pref.tmdbId}:`, error);
                    continue; // Skip this preference if we can't get movie details
                }
            }

            // Save preference
            await prisma.userPreference.upsert({
                where: { userId_movieId: { userId, movieId: movie.id } },
                update: { rating: pref.rating, seen: pref.seen },
                create: {
                    userId,
                    movieId: movie.id,
                    rating: pref.rating,
                    seen: pref.seen,
                },
            });
        }

        res.status(200).json({ message: 'Preferences saved with TMDb data.' });
    } catch (error) {
        console.error('Error saving preferences:', error);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
};

export const searchAny = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.query.query;

        if (!query) {
            res.status(400).json({ error: 'Missing query parameter' });
            return;
        }

        const results = await searchMulti(String(query));
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);

        // Handle specific TMDB API errors
        const err = error as { response?: { status: number } };
        if (err.response?.status === 401) {
            res.status(500).json({
                error: 'TMDB API authentication failed. Please check your API credentials.'
            });
        } else if (err.response?.status === 404) {
            res.status(404).json({ error: 'No results found' });
        } else {
            res.status(500).json({ error: 'Search failed' });
        }
    }
};

export const genreMovieList = async (req: Request, res: Response): Promise<void> => {
    try {
        const genre = String(req.query.genre);
        const dbgenre = await prisma.genre.findFirst({
            where: { name: genre },
        });

        if (!genre) {
            res.status(400).json({ error: "Missing genre" });
            return;
        }
        if (!dbgenre) {
            res.status(404).json({ error: "genre unavailable" });
        }
        console.log("getting movies");
        const result = await getGenreMovies(String(dbgenre?.id));
        res.json(result);

    } catch (error) {
        const err = error as { response?: { status: number } };
        if (err.response?.status === 401) {
            res.status(500).json({
                error: 'TMDB API authentication failed. Please check your API credentials.'
            });
        } else if (err.response?.status === 404) {
            res.status(404).json({ error: 'No results found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch genre movies' });
        }
    }
};

export const getPopularList = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(String(req.query.page));
        const result = await getPopularMovies(page);
        res.json(result);
    } catch (error) {
        const err = error as { response?: { status: number } };
        if (err.response?.status === 401) {
            res.status(500).json({
                error: 'TMDB API authentication failed. Please check your API credentials.'
            });
        } else if (err.response?.status === 404) {
            res.status(404).json({ error: 'No results found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch popular movies' });
        }
    }
}

export const SimilarList = async (req: Request, res: Response): Promise<void> => {
    try {
        const movie_id = parseInt(String(req.query.tmdbId));
        const result = getSimilar(movie_id);
        res.json(result);
    } catch (error) {
        const err = error as { response?: { status: number } };
        if (err.response?.status === 401) {
            res.status(500).json({
                error: 'TMDB API authentication failed. Please check your API credentials.'
            });
        } else if (err.response?.status === 404) {
            res.status(404).json({ error: 'No results found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch popular movies' });
        }
    }
}