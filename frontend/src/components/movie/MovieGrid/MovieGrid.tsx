import React, { useState } from 'react';
import MovieCard from '../../common/MovieCard/MovieCard';
import GenreFilter from '../GenreFilter/GenreFilter';
import styles from './MovieGrid.module.css';

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
}

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  onMovieSelect?: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  onMovieSelect
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'date'>('rating');

  const filteredMovies = movies
    .filter(movie => 
      selectedGenres.length === 0 ||
      selectedGenres.some(genre => movie.genres.includes(genre))
    )
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.voteAverage - a.voteAverage;
      }
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[...Array(12)].map((_, index) => (
          <div key={index} className={styles.skeletonCard} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />
        
        <div className={styles.sortControl}>
          <label htmlFor="sort" className={styles.sortLabel}>
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'date')}
            className={styles.sortSelect}
          >
            <option value="rating">Rating</option>
            <option value="date">Release Date</option>
          </select>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className={styles.noResults}>
          No movies found matching your criteria
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredMovies.map((movie) => (
            <div key={movie.id} className={styles.gridItem}>
              <MovieCard
                {...movie}
                onClick={() => onMovieSelect?.(movie)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieGrid; 