import React, { useRef } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieCarousel.module.css';

interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  isLoading = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.carousel}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className={styles.carousel}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.loadingContainer}>
          <p>No movies available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <button
            onClick={() => scroll('left')}
            className={styles.scrollButton}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className={styles.scrollButton}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        <div className={styles.movieList}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;