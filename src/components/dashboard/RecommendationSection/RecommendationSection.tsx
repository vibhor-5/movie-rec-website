import React from 'react';
import MovieCarousel from '../../common/MovieCarousel/MovieCarousel';
import styles from './RecommendationSection.module.css';

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
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
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.title}>Recommended for You</h2>
        <p className={styles.subtitle}>
          Based on your preferences and viewing history
        </p>
        <MovieCarousel
          title="Our Best Picks"
          movies={hybridMovies}
          isLoading={isLoading}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Because You Liked...</h2>
        <p className={styles.subtitle}>
          Movies similar to your favorites
        </p>
        <MovieCarousel
          title="Content-Based Recommendations"
          movies={contentBasedMovies}
          isLoading={isLoading}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Users Like You Also Enjoyed</h2>
        <p className={styles.subtitle}>
          Based on similar users' preferences
        </p>
        <MovieCarousel
          title="Collaborative Recommendations"
          movies={collaborativeMovies}
          isLoading={isLoading}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Trending Now</h2>
        <p className={styles.subtitle}>
          What's popular in the community
        </p>
        <MovieCarousel
          title="Trending Movies"
          movies={trendingMovies}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default RecommendationSection; 