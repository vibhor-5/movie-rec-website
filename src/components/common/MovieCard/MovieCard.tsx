import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
  genres,
  overview
}) => {
  const year = new Date(releaseDate).getFullYear();
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '/images/placeholders/movie-placeholder.jpg';

  return (
    <Link to={`/movie/${id}`} className={styles.card}>
      <div className={styles.posterContainer}>
        <img
          src={posterUrl}
          alt={title}
          className={styles.poster}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <div className={styles.rating}>
            <span className={styles.ratingValue}>{voteAverage.toFixed(1)}</span>
            <span className={styles.ratingMax}>/10</span>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.year}>{year}</span>
          <span className={styles.genres}>
            {genres.slice(0, 2).join(', ')}
          </span>
        </div>
        <p className={styles.overview}>
          {overview.length > 100
            ? `${overview.substring(0, 100)}...`
            : overview}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard; 