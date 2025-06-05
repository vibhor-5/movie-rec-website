import React from 'react';
import styles from './GenreFilter.module.css';

const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller'
];

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  onGenreChange
}) => {
  const handleGenreToggle = (genre: string) => {
    const newSelectedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    onGenreChange(newSelectedGenres);
  };

  return (
    <div className={styles.container}>
      <div className={styles.genres}>
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreToggle(genre)}
            className={`${styles.genreButton} ${
              selectedGenres.includes(genre) ? styles.selected : ''
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      {selectedGenres.length > 0 && (
        <button
          onClick={() => onGenreChange([])}
          className={styles.clearButton}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default GenreFilter; 