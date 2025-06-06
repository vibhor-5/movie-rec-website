import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Onboarding.module.css';

interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string;
  genres: string[];
}

interface MovieRating {
  movieId: number;
  rating: number;
}

const MOCK_MOVIES: Movie[] = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994, poster: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama'] },
  { id: 2, title: 'The Godfather', year: 1972, poster: 'https://images.pexels.com/photos/7234243/pexels-photo-7234243.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'] },
  { id: 3, title: 'The Dark Knight', year: 2008, poster: 'https://images.pexels.com/photos/8118880/pexels-photo-8118880.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Crime'] },
  { id: 4, title: 'Pulp Fiction', year: 1994, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'] },
  { id: 5, title: 'Forrest Gump', year: 1994, poster: 'https://images.pexels.com/photos/2549565/pexels-photo-2549565.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'] },
  { id: 6, title: 'Inception', year: 2010, poster: 'https://images.pexels.com/photos/8118890/pexels-photo-8118890.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'] },
  { id: 7, title: 'The Matrix', year: 1999, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'] },
  { id: 8, title: 'Goodfellas', year: 1990, poster: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'] },
  { id: 9, title: 'The Lord of the Rings', year: 2001, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Adventure', 'Fantasy'] },
  { id: 10, title: 'Star Wars', year: 1977, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'] },
  { id: 11, title: 'Casablanca', year: 1942, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'] },
  { id: 12, title: 'Citizen Kane', year: 1941, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama'] },
  { id: 13, title: 'Titanic', year: 1997, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'] },
  { id: 14, title: 'Jurassic Park', year: 1993, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'] },
  { id: 15, title: 'Avatar', year: 2009, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'] },
  { id: 16, title: 'The Avengers', year: 2012, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'] },
  { id: 17, title: 'Toy Story', year: 1995, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'] },
  { id: 18, title: 'Finding Nemo', year: 2003, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'] },
  { id: 19, title: 'The Lion King', year: 1994, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'] },
  { id: 20, title: 'Frozen', year: 2013, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'] }
];

const GENRES = ['All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Romance', 'Sci-Fi'];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const totalSteps = 3;
  const minRatings = 10;
  const progress = (currentStep / totalSteps) * 100;
  const ratedMoviesCount = ratings.length;
  const canContinue = ratedMoviesCount >= minRatings;

  useEffect(() => {
    // Simulate loading movies
    setIsLoading(true);
    setTimeout(() => {
      setMovies(MOCK_MOVIES);
      setFilteredMovies(MOCK_MOVIES);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = movies;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(movie =>
        movie.genres.includes(selectedGenre)
      );
    }

    setFilteredMovies(filtered);
  }, [movies, searchQuery, selectedGenre]);

  const handleMovieRating = (movieId: number, rating: number) => {
    setRatings(prev => {
      const existingRating = prev.find(r => r.movieId === movieId);
      if (existingRating) {
        return prev.map(r =>
          r.movieId === movieId ? { ...r, rating } : r
        );
      } else {
        return [...prev, { movieId, rating }];
      }
    });
  };

  const getMovieRating = (movieId: number): number => {
    const rating = ratings.find(r => r.movieId === movieId);
    return rating ? rating.rating : 0;
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const renderWelcomeStep = () => (
    <div className={styles.stepContent}>
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎬</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2d3748' }}>
          Welcome to MovieRec!
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#4a5568', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          We're excited to help you discover amazing movies! To get started, we need to learn about your taste in films.
        </p>
        <div style={{ background: '#f7fafc', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2d3748' }}>
            Here's how it works:
          </h3>
          <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ background: '#4299e1', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>1</span>
              <span>Rate movies you've watched (at least 10)</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ background: '#4299e1', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>2</span>
              <span>Tell us your preferences</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ background: '#4299e1', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>3</span>
              <span>Get personalized recommendations!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMovieRatingStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.searchContainer}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div className={styles.filterButtons}>
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`${styles.filterButton} ${selectedGenre === genre ? styles.active : ''}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No movies found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={styles.movieGrid}>
          {filteredMovies.map(movie => (
            <div
              key={movie.id}
              className={`${styles.movieCard} ${getMovieRating(movie.id) > 0 ? styles.selected : ''}`}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className={styles.moviePoster}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300';
                }}
              />
              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <p className={styles.movieYear}>{movie.year}</p>
                <div className={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`${styles.star} ${star <= getMovieRating(movie.id) ? styles.filled : ''}`}
                      onClick={() => handleMovieRating(movie.id, star)}
                      fill={star <= getMovieRating(movie.id) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPreferencesStep = () => (
    <div className={styles.stepContent}>
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🎯</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2d3748' }}>
          Perfect! You've rated {ratedMoviesCount} movies
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#4a5568', marginBottom: '2rem' }}>
          Our algorithm is now learning your preferences. You can fine-tune your recommendations anytime in your profile settings.
        </p>
        <div style={{ background: '#f0fff4', border: '1px solid #9ae6b4', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#22543d' }}>
            What happens next?
          </h3>
          <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
              <span>We'll analyze your ratings to understand your taste</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
              <span>Find users with similar preferences</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
              <span>Generate personalized recommendations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
              <span>Show you how our algorithms work</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderWelcomeStep();
      case 2:
        return renderMovieRatingStep();
      case 3:
        return renderPreferencesStep();
      default:
        return renderWelcomeStep();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Let\'s Get Started';
      case 2:
        return 'Rate Some Movies';
      case 3:
        return 'You\'re All Set!';
      default:
        return 'Welcome';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Help us understand your movie preferences to get personalized recommendations';
      case 2:
        return `Rate movies you've watched to help us understand your taste (${ratedMoviesCount}/${minRatings} minimum)`;
      case 3:
        return 'Your profile is ready! Let\'s start discovering amazing movies together.';
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>MovieRec</div>
          <div className={styles.progressContainer}>
            <span className={styles.progressText}>
              Step {currentStep} of {totalSteps}
            </span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.stepContainer}>
          <div className={styles.stepHeader}>
            <h1 className={styles.stepTitle}>{getStepTitle()}</h1>
            <p className={styles.stepSubtitle}>{getStepSubtitle()}</p>
          </div>

          {getStepContent()}

          <div className={styles.actions}>
            <div className={styles.selectedCount}>
              {currentStep === 2 && (
                <span className={canContinue ? styles.complete : ''}>
                  {ratedMoviesCount >= minRatings 
                    ? `✓ ${ratedMoviesCount} movies rated` 
                    : `${ratedMoviesCount}/${minRatings} movies rated`
                  }
                </span>
              )}
            </div>
            <div className={styles.actionButtons}>
              <button
                onClick={handleSkip}
                className={styles.skipButton}
              >
                Skip for now
              </button>
              <button
                onClick={handleContinue}
                className={styles.continueButton}
                disabled={currentStep === 2 && !canContinue}
              >
                {currentStep === totalSteps ? 'Get Started!' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;