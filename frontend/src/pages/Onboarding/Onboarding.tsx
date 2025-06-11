import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Onboarding.module.css';

interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  rating: number;
  popularity: number;
}

interface MovieRating {
  movieId: number;
  rating: number;
}

const POPULAR_MOVIES: Movie[] = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994, poster: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama'], rating: 9.3, popularity: 95 },
  { id: 2, title: 'The Godfather', year: 1972, poster: 'https://images.pexels.com/photos/7234243/pexels-photo-7234243.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'], rating: 9.2, popularity: 92 },
  { id: 3, title: 'The Dark Knight', year: 2008, poster: 'https://images.pexels.com/photos/8118880/pexels-photo-8118880.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Crime'], rating: 9.0, popularity: 98 },
  { id: 4, title: 'Pulp Fiction', year: 1994, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'], rating: 8.9, popularity: 89 },
  { id: 5, title: 'Forrest Gump', year: 1994, poster: 'https://images.pexels.com/photos/2549565/pexels-photo-2549565.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'], rating: 8.8, popularity: 94 },
  { id: 6, title: 'Inception', year: 2010, poster: 'https://images.pexels.com/photos/8118890/pexels-photo-8118890.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 8.8, popularity: 96 },
  { id: 7, title: 'The Matrix', year: 1999, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 8.7, popularity: 91 },
  { id: 8, title: 'Goodfellas', year: 1990, poster: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Crime', 'Drama'], rating: 8.7, popularity: 85 },
  { id: 9, title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Adventure', 'Fantasy'], rating: 8.8, popularity: 93 },
  { id: 10, title: 'Star Wars: Episode IV - A New Hope', year: 1977, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 8.6, popularity: 97 },
  { id: 11, title: 'Casablanca', year: 1942, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'], rating: 8.5, popularity: 78 },
  { id: 12, title: 'Citizen Kane', year: 1941, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama'], rating: 8.3, popularity: 72 },
  { id: 13, title: 'Titanic', year: 1997, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Romance'], rating: 7.8, popularity: 99 },
  { id: 14, title: 'Jurassic Park', year: 1993, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'], rating: 8.1, popularity: 95 },
  { id: 15, title: 'Avatar', year: 2009, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Sci-Fi'], rating: 7.8, popularity: 97 },
  { id: 16, title: 'The Avengers', year: 2012, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'], rating: 8.0, popularity: 98 },
  { id: 17, title: 'Toy Story', year: 1995, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 8.3, popularity: 88 },
  { id: 18, title: 'Finding Nemo', year: 2003, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 8.2, popularity: 90 },
  { id: 19, title: 'The Lion King', year: 1994, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 8.5, popularity: 92 },
  { id: 20, title: 'Frozen', year: 2013, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Family'], rating: 7.4, popularity: 96 },
  { id: 21, title: 'Interstellar', year: 2014, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Sci-Fi'], rating: 8.6, popularity: 89 },
  { id: 22, title: 'Parasite', year: 2019, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Drama', 'Thriller'], rating: 8.6, popularity: 87 },
  { id: 23, title: 'Spider-Man: Into the Spider-Verse', year: 2018, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Animation', 'Action'], rating: 8.4, popularity: 91 },
  { id: 24, title: 'Black Panther', year: 2018, poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300', genres: ['Action', 'Adventure'], rating: 7.3, popularity: 94 }
];

const GENRES = ['All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Romance', 'Sci-Fi', 'Thriller'];

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
      // Sort by popularity for better initial display
      const sortedMovies = [...POPULAR_MOVIES].sort((a, b) => b.popularity - a.popularity);
      setMovies(sortedMovies);
      setFilteredMovies(sortedMovies);
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
      // Complete onboarding and redirect to dashboard
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const renderWelcomeStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.welcomeContainer}>
        <div className={styles.welcomeIcon}>🎬</div>
        <h2 className={styles.welcomeTitle}>
          Welcome to MovieRec!
        </h2>
        <p className={styles.welcomeDescription}>
          We're excited to help you discover amazing movies! To get started, we need to learn about your taste in films.
        </p>
        <div className={styles.processCard}>
          <h3 className={styles.processTitle}>
            Here's how it works:
          </h3>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <span className={styles.processNumber}>1</span>
              <span>Rate popular movies you've watched</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.processNumber}>2</span>
              <span>Tell us your preferences</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.processNumber}>3</span>
              <span>Get personalized recommendations!</span>
            </div>
          </div>
        </div>
        <div className={styles.welcomeStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>Movies in our database</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>3</div>
            <div className={styles.statLabel}>Recommendation algorithms</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>User satisfaction rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMovieRatingStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
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
              <div className={styles.moviePosterContainer}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className={styles.moviePoster}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=300';
                  }}
                />
                <div className={styles.movieOverlay}>
                  <div className={styles.movieRating}>
                    <Star className={styles.imdbStar} />
                    <span>{movie.rating}</span>
                  </div>
                </div>
              </div>
              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <div className={styles.movieMeta}>
                  <span className={styles.movieYear}>{movie.year}</span>
                  <span className={styles.movieGenres}>
                    {movie.genres.slice(0, 2).join(', ')}
                  </span>
                </div>
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

  const renderCompletionStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.completionContainer}>
        <div className={styles.completionIcon}>🎯</div>
        <h2 className={styles.completionTitle}>
          Perfect! You've rated {ratedMoviesCount} movies
        </h2>
        <p className={styles.completionDescription}>
          Our algorithm is now learning your preferences. You can fine-tune your recommendations anytime in your profile settings.
        </p>
        <div className={styles.completionCard}>
          <h3 className={styles.completionCardTitle}>
            What happens next?
          </h3>
          <div className={styles.completionSteps}>
            <div className={styles.completionStep}>
              <span className={styles.checkmark}>✓</span>
              <span>We'll analyze your ratings to understand your taste</span>
            </div>
            <div className={styles.completionStep}>
              <span className={styles.checkmark}>✓</span>
              <span>Find users with similar preferences</span>
            </div>
            <div className={styles.completionStep}>
              <span className={styles.checkmark}>✓</span>
              <span>Generate personalized recommendations</span>
            </div>
            <div className={styles.completionStep}>
              <span className={styles.checkmark}>✓</span>
              <span>Show you how our algorithms work</span>
            </div>
          </div>
        </div>
        <div className={styles.algorithmPreview}>
          <h3 className={styles.algorithmPreviewTitle}>Your Taste Profile</h3>
          <div className={styles.tasteProfile}>
            <div className={styles.tasteItem}>
              <span className={styles.tasteLabel}>Preferred Genres</span>
              <div className={styles.tasteGenres}>
                {['Drama', 'Sci-Fi', 'Action'].map(genre => (
                  <span key={genre} className={styles.tasteGenre}>{genre}</span>
                ))}
              </div>
            </div>
            <div className={styles.tasteItem}>
              <span className={styles.tasteLabel}>Average Rating</span>
              <span className={styles.tasteValue}>
                {ratedMoviesCount > 0 
                  ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                  : '0.0'
                } / 5.0
              </span>
            </div>
            <div className={styles.tasteItem}>
              <span className={styles.tasteLabel}>Movies Rated</span>
              <span className={styles.tasteValue}>{ratedMoviesCount}</span>
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
        return renderCompletionStep();
      default:
        return renderWelcomeStep();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Let\'s Get Started';
      case 2:
        return 'Rate Popular Movies';
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
                {currentStep === totalSteps ? (
                  <>
                    Get Started!
                    <ChevronRight className={styles.buttonIcon} />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className={styles.buttonIcon} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;