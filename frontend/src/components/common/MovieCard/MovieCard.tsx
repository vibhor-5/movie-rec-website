import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
  onClick?: () => void;
  showAsLink?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage = 0,
  genres = [],
  overview = '',
  onClick,
  showAsLink = false
}) => {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown';
  const posterUrl = posterPath || '/images/placeholders/movie-placeholder.jpg';
  const safeVoteAverage = typeof voteAverage === 'number' ? voteAverage : 0;
  const safeGenres = Array.isArray(genres) ? genres : [];
  const safeOverview = typeof overview === 'string' ? overview : '';

  const cardContent = (
    <>
      <div className={styles.posterContainer}>
        <img
          src={posterUrl}
          alt={title}
          className={styles.poster}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300';
          }}
        />
        <div className={styles.overlay}>
          <div className={styles.rating}>
            <span className={styles.ratingValue}>{safeVoteAverage.toFixed(1)}</span>
            <span className={styles.ratingMax}>/10</span>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.year}>{year}</span>
          <span className={styles.genres}>
            {safeGenres.slice(0, 2).join(', ')}
          </span>
        </div>
        <p className={styles.overview}>
          {safeOverview.length > 100
            ? `${safeOverview.substring(0, 100)}...`
            : safeOverview}
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div className={styles.card} onClick={onClick} style={{ cursor: 'pointer' }}>
        {cardContent}
      </div>
    );
  }

  if (showAsLink) {
    return (
      <Link to={`/movie/${id}`} className={styles.card}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={styles.card}>
      {cardContent}
    </div>
  );
};

export default MovieCard;