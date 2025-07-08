import React from 'react';
import MovieCarousel from '../../common/MovieCarousel/MovieCarousel';
import styles from './RecommendationSection.module.css';

interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string;
  genres: string[];
  overview: string;
  voteAverage: number;
  imdbId?: string | null;
  tmdbId?: number;
  year?: number | null;
}

interface RecommendationSectionProps {
  collaborativeMovies: Movie[];
  contentBasedMovies: Movie[];
  hybridMovies: Movie[];
  trendingMovies: Movie[];
  isLoading?: boolean;
  onMovieSelect?: (movie: Movie) => void;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  collaborativeMovies,
  contentBasedMovies,
  hybridMovies,
  trendingMovies,
  isLoading = false,
  onMovieSelect
}) => {
  // Helper to convert Movie with posterUrl to Movie with posterPath for MovieCard
  function convertToMovieCard(movie: Movie): any {
    return {
      ...movie,
      posterPath: movie.posterUrl,
    };
  }

  // Wrap the onMovieSelect to convert back to the parent Movie type
  const handleMovieClick = (movie: any) => {
    if (onMovieSelect) {
      const { posterPath, ...rest } = movie;
      onMovieSelect({ ...rest, posterUrl: posterPath });
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.title}>Recommended for You</h2>
        <p className={styles.subtitle}>
          Based on your preferences and viewing history
        </p>
        <MovieCarousel
          title="Our Best Picks"
          movies={hybridMovies.map(convertToMovieCard)}
          isLoading={isLoading}
          onMovieClick={handleMovieClick}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Because You Liked...</h2>
        <p className={styles.subtitle}>
          Movies similar to your favorites
        </p>
        <MovieCarousel
          title="Content-Based Recommendations"
          movies={contentBasedMovies.map(convertToMovieCard)}
          isLoading={isLoading}
          onMovieClick={handleMovieClick}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Users Like You Also Enjoyed</h2>
        <p className={styles.subtitle}>
          Based on similar users' preferences
        </p>
        <MovieCarousel
          title="Collaborative Recommendations"
          movies={collaborativeMovies.map(convertToMovieCard)}
          isLoading={isLoading}
          onMovieClick={handleMovieClick}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Trending Now</h2>
        <p className={styles.subtitle}>
          What's popular in the community
        </p>
        <MovieCarousel
          title="Trending Movies"
          movies={trendingMovies.map(convertToMovieCard)}
          isLoading={isLoading}
          onMovieClick={handleMovieClick}
        />
      </section>
    </div>
  );
};

export default RecommendationSection;