import React, { useEffect } from 'react';
import { X, Star, Calendar, Clock, Play, Plus, Heart, Share } from 'lucide-react';
import styles from './MovieOverlay.module.css';

interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
  year?: number | null;
  runtime?: number;
  imdbId?: string | null;
  tmdbId?: number;
}

interface MovieOverlayProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist?: (movie: Movie) => void;
  onMarkAsWatched?: (movie: Movie) => void;
  onRate?: (movie: Movie, rating: number) => void;
}

const MovieOverlay: React.FC<MovieOverlayProps> = ({
  movie,
  isOpen,
  onClose,
  onAddToWatchlist,
  onMarkAsWatched,
  onRate
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const posterUrl = movie.posterPath || 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=500';
  const year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown');
  const formattedRating = typeof movie.voteAverage === 'number' ? movie.voteAverage.toFixed(1) : '0.0';

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.content}>
          <div className={styles.posterSection}>
            <img
              src={posterUrl}
              alt={movie.title}
              className={styles.poster}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=500';
              }}
            />
            <div className={styles.ratingBadge}>
              <Star className={styles.starIcon} />
              <span>{formattedRating}/10</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>{movie.title}</h1>
              
              <div className={styles.metadata}>
                <div className={styles.metaItem}>
                  <Calendar className={styles.metaIcon} />
                  <span>{year}</span>
                </div>
                {movie.runtime && (
                  <div className={styles.metaItem}>
                    <Clock className={styles.metaIcon} />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
              </div>

              <div className={styles.genres}>
                {movie.genres.map((genre, index) => (
                  <span key={index} className={styles.genreTag}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.overviewTitle}>Overview</h2>
              <p className={styles.overview}>
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{formattedRating}</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{year}</div>
                <div className={styles.statLabel}>Year</div>
              </div>
              {movie.runtime && (
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{movie.runtime}</div>
                  <div className={styles.statLabel}>Minutes</div>
                </div>
              )}
              <div className={styles.statItem}>
                <div className={styles.statValue}>{movie.genres.length}</div>
                <div className={styles.statLabel}>Genres</div>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={`${styles.actionButton} ${styles.primaryAction}`}
                onClick={() => onMarkAsWatched?.(movie)}
              >
                <Play className={styles.actionIcon} />
                Mark as Watched
              </button>
              
              <button 
                className={`${styles.actionButton} ${styles.secondaryAction}`}
                onClick={() => onAddToWatchlist?.(movie)}
              >
                <Plus className={styles.actionIcon} />
                Add to Watchlist
              </button>
              
              <button 
                className={`${styles.actionButton} ${styles.secondaryAction}`}
                onClick={() => {
                  // You can implement a rating modal here
                  const rating = prompt('Rate this movie (1-10):');
                  if (rating && !isNaN(Number(rating))) {
                    const numRating = Math.max(1, Math.min(10, Number(rating)));
                    onRate?.(movie, numRating);
                  }
                }}
              >
                <Heart className={styles.actionIcon} />
                Rate Movie
              </button>
              
              <button 
                className={`${styles.actionButton} ${styles.secondaryAction}`}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: movie.title,
                      text: `Check out ${movie.title} - ${movie.overview?.substring(0, 100)}...`,
                      url: window.location.href
                    });
                  } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(`${movie.title} - ${window.location.href}`);
                    alert('Movie link copied to clipboard!');
                  }
                }}
              >
                <Share className={styles.actionIcon} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieOverlay;