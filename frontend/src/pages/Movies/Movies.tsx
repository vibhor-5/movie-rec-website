import React, { useState, useEffect } from 'react';
import { Search, Filter, Sliders } from 'lucide-react';
import MovieGrid from '../../components/movie/MovieGrid/MovieGrid';
import MovieOverlay from '../../components/common/MovieOverlay/MovieOverlay';
import { getPopularMovies, searchMovies, getMoviesByGenre } from '../../api/movies';
import styles from './Movies.module.css';

interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
  year?: number | null;
  imdbId?: string | null;
  tmdbId?: number;
}

const Movies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        if (searchQuery.trim()) {
          const searchResults = await searchMovies(searchQuery);
          setMovies(searchResults);
        } else if (selectedGenre) {
          const genreMovies = await getMoviesByGenre(selectedGenre);
          setMovies(genreMovies);
        } else {
          const popularMovies = await getPopularMovies(1);
          setMovies(popularMovies);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, selectedGenre]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(''); // Clear genre filter when searching
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery(''); // Clear search when filtering by genre
  };
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedMovie(null);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    console.log('Added to watchlist:', movie.title);
    // TODO: Implement watchlist functionality
  };

  const handleMarkAsWatched = (movie: Movie) => {
    console.log('Marked as watched:', movie.title);
    // TODO: Implement watched functionality
  };

  const handleRateMovie = (movie: Movie, rating: number) => {
    console.log('Rated movie:', movie.title, 'Rating:', rating);
    // TODO: Implement rating functionality
  };

  return (
    <div className="bg-slate-900 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Discover Movies
          </h1>
          <p className="text-xl text-slate-300">
            Find your next favorite film from our curated collection
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-slate-800 rounded-lg shadow-sm overflow-hidden mb-8 border border-slate-700">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 placeholder-slate-400 text-white focus:outline-none focus:placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-5 w-5 mr-2 text-slate-400" />
                  Filters
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Sliders className="h-5 w-5 mr-2" />
                  Sort
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => handleGenreChange(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Genres</option>
                      <option value="Action">Action</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Animation">Animation</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Crime">Crime</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Drama">Drama</option>
                      <option value="Family">Family</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Horror">Horror</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Thriller">Thriller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Year Range</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="number"
                        placeholder="From"
                        value={yearFrom}
                        onChange={(e) => setYearFrom(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="To"
                        value={yearTo}
                        onChange={(e) => setYearTo(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-800 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Rating</label>
                    <select 
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option>Any Rating</option>
                      <option>8+ Stars</option>
                      <option>7+ Stars</option>
                      <option>6+ Stars</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movie Grid */}
        <div className="bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-700">
          <div className="p-6">
            <MovieGrid 
              movies={movies} 
              isLoading={isLoading}
              onMovieSelect={handleMovieSelect}
            />
          </div>
        </div>
      </div>

      {/* Movie Overlay Modal */}
      {selectedMovie && (
        <MovieOverlay
          movie={selectedMovie}
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          onAddToWatchlist={handleAddToWatchlist}
          onMarkAsWatched={handleMarkAsWatched}
          onRate={handleRateMovie}
        />
      )}
    </div>
  );
};

export default Movies;