import { Request, Response } from 'express';
import { getMovieDetails, searchMovie, getGenreMovies, getPopularMovies, getSimilar } from '../utils/tmdb';
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

        // Validate that the user exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            res.status(401).json({ error: 'User not found. Please log in again.' });
            return;
        }

        const successfulPreferences: any[] = [];
        const failedPreferences: any[] = [];

        for (const pref of preferences) {
            if (!pref.tmdbId) {
                console.warn('Skipping preference without tmdbId:', pref);
                failedPreferences.push({
                    tmdbId: pref.tmdbId,
                    reason: 'Missing tmdbId'
                });
                continue;
            }

            let movie = null;

            try {
                // First, try to find the movie in the database
                movie = await prisma.movie.findUnique({ 
                    where: { tmdbId: pref.tmdbId } 
                });

                // If not found, try to fetch from TMDB and create it
                if (!movie) {
                    try {
                        const movieData = await getMovieDetails(pref.tmdbId);
                        movie = await prisma.movie.create({ data: movieData });
                        console.log(`Successfully created movie with tmdbId: ${pref.tmdbId}`);
                    } catch (tmdbError) {
                        console.error(`Failed to fetch/create movie details for tmdbId ${pref.tmdbId}:`, tmdbError);
                        failedPreferences.push({
                            tmdbId: pref.tmdbId,
                            reason: 'Failed to fetch movie details from TMDB'
                        });
                        continue; // Skip this preference
                    }
                }

                // Double-check that movie is valid before proceeding
                if (!movie || !movie.id) {
                    console.error(`Movie object is invalid for tmdbId ${pref.tmdbId}:`, movie);
                    failedPreferences.push({
                        tmdbId: pref.tmdbId,
                        reason: 'Invalid movie object after creation/retrieval'
                    });
                    continue;
                }

                // Save preference with validated movie and user
                await prisma.userPreference.upsert({
                    where: { userId_movieId: { userId, movieId: movie.id } },
                    update: { 
                        rating: pref.rating, 
                        seen: pref.seen 
                    },
                    create: {
                        userId,
                        movieId: movie.id,
                        rating: pref.rating,
                        seen: pref.seen,
                    },
                });

                successfulPreferences.push({
                    tmdbId: pref.tmdbId,
                    movieId: movie.id,
                    rating: pref.rating,
                    seen: pref.seen
                });

            } catch (error) {
                console.error(`Error processing preference for tmdbId ${pref.tmdbId}:`, error);
                failedPreferences.push({
                    tmdbId: pref.tmdbId,
                    reason: error instanceof Error ? error.message : 'Unknown error'
                });
                continue;
            }
        }

        // Return detailed response about successes and failures
        const response = {
            message: `Processed ${preferences.length} preferences`,
            successful: successfulPreferences.length,
            failed: failedPreferences.length,
            successfulPreferences,
            ...(failedPreferences.length > 0 && { failedPreferences })
        };

        if (successfulPreferences.length === 0) {
            res.status(400).json({
                ...response,
                error: 'No preferences were successfully saved'
            });
        } else {
            res.status(200).json(response);
        }

    } catch (error) {
        console.error('Error saving preferences:', error);
        res.status(500).json({ 
            error: 'Failed to save preferences',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const search= async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.query.query;

        if (!query) {
            res.status(400).json({ error: 'Missing query parameter' });
            return;
        }

        const results = await searchMovie(String(query));
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
            return;
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