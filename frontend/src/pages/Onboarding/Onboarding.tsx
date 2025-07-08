import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import styles from "./Onboarding.module.css";

import {
  userPreferences,
  markOnboardingCompleted,
  getPopularMovies,
  getGenreMovies,
  searchMovies,
  getAvailableGenres,
} from "../../api/onboarding";
import { useAuthContext } from "../../contexts/AuthContext";

interface Movie {
  tmdbId: number;
  title: string;
  year: number | null;
  posterUrl: string | null;
  genre: string[];
  voteAverage: number;
  overview: string;
}

interface MovieRating {
  movieId: number;
  rating: number;
  watched: boolean;
}

interface Genre {
  id: number;
  name: string;
}

// Helper to normalize genre name to Sentencecase
function normalizeGenreName(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalSteps = 3;
  const minRatings = 10;
  const progress = (currentStep / totalSteps) * 100;
  const ratedMoviesCount = ratings.filter(
    (r) => r.watched && r.rating > 0
  ).length;
  const canContinue = ratedMoviesCount >= minRatings;

  // Handle escape key and navigation safety
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (currentStep === 1) {
          setShowExitConfirm(true);
        } else {
          setCurrentStep(currentStep - 1);
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (currentStep > 1) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentStep]);

  // Load genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await getAvailableGenres();
        // Accepts both array and object { genres: [...] }
        setGenres(((genresData as any).genres || genresData) as Genre[]);
      } catch (error) {
        console.error("Error loading genres:", error);
        // Fallback to common genres if API fails
        setGenres([
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Sci-Fi" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
        ]);
      }
    };

    loadGenres();
  }, []);

  // Load movies based on current state
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        let moviesData: any = [];

        if (searchQuery.trim()) {
          // Search movies
          moviesData = await searchMovies(searchQuery);
        } else if (selectedGenre !== "All") {
          // Get movies by genre
          moviesData = await getGenreMovies(
            normalizeGenreName(selectedGenre),
            currentPage
          );
        } else {
          // Get popular movies
          moviesData = await getPopularMovies(currentPage);
        }

        // Accepts both array and object { results: [...] }
        const movieList = (moviesData.results || moviesData || []).map((movie: any) => ({
          ...movie,
          posterUrl: movie.posterUrl || (movie.posterPath ? `https://image.tmdb.org/t/p/w500/${movie.posterPath}` : null),
          genre: Array.isArray(movie.genre) ? movie.genre : (movie.genres || []),
        }));
        setMovies(movieList);
        setFilteredMovies(movieList);
      } catch (error) {
        console.error("Error loading movies:", error);
        alert("Error loading movies: " + ((error as any)?.message || error));
        setMovies([]);
        setFilteredMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentStep === 2) {
      loadMovies();
    }
  }, [currentStep, searchQuery, selectedGenre, currentPage]);

  // Filter movies based on search and genre
  useEffect(() => {
    let filtered = movies;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Note: Genre filtering is now handled by the API, so we don't need to filter here
    // The API already returns movies for the selected genre

    setFilteredMovies(filtered);
  }, [movies, searchQuery]);

  const handleMovieRating = (movieId: number, rating: number) => {
    console.log("Rating movie:", movieId, "with rating:", rating);
    setRatings((prev) => {
      const existingRating = prev.find((r) => r.movieId === movieId);
      if (existingRating) {
        return prev.map((r) => (r.movieId === movieId ? { ...r, rating } : r));
      } else {
        return [...prev, { movieId, rating, watched: true }];
      }
    });
  };

  const handleWatchedToggle = (movieId: number, watched: boolean) => {
    console.log("Toggling watched for movie:", movieId, "watched:", watched);
    setRatings((prev) => {
      const existingRating = prev.find((r) => r.movieId === movieId);
      if (existingRating) {
        return prev.map((r) =>
          r.movieId === movieId
            ? { ...r, watched, rating: watched ? r.rating : 0 }
            : r
        );
      } else {
        return [...prev, { movieId, rating: 0, watched }];
      }
    });
  };

  const getMovieRating = (movieId: number): MovieRating => {
    const rating = ratings.find((r) => r.movieId === movieId);
    return rating || { movieId, rating: 0, watched: false };
  };

  const handleContinue = async () => {
    if (currentStep === 2) {
      // Save preferences before continuing
      setIsSaving(true);
      try {
        const token = localStorage.getItem("token");
        if (token && ratings.length > 0) {
          const preferencesToSave = ratings
            .filter((r) => r.watched && r.rating > 0)
            .map((r) => ({
              tmdbId: r.movieId,
              rating: r.rating,
              seen: r.watched,
            }));
          if (preferencesToSave.length > 0) {
            await userPreferences(token, preferencesToSave);
            console.log("Preferences saved successfully");
          }
        }
      } catch (error) {
        console.error("Error saving preferences:", error);
      } finally {
        setIsSaving(false);
      }
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding and redirect to dashboard
        await completeOnboarding();
      }
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await markOnboardingCompleted(token);
        console.log("Onboarding marked as completed");
      }
    } catch (error) {
      console.error("Error marking onboarding as completed:", error);
    }
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    navigate("/dashboard");
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSkip = () => {
    if (currentStep === 2 && ratedMoviesCount > 0) {
      setShowSkipConfirm(true);
    } else {
      navigate("/dashboard");
    }
  };

  const confirmSkip = () => {
    setShowSkipConfirm(false);
    navigate("/dashboard");
  };

  const cancelSkip = () => {
    setShowSkipConfirm(false);
  };

  const renderWelcomeStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.welcomeContainer}>
        <div className={styles.welcomeIcon}>🎬</div>
        <h2 className={styles.welcomeTitle}>Welcome to MovieRec!</h2>
        <p className={styles.welcomeDescription}>
          We're excited to help you discover amazing movies! To get started, we
          need to learn about your taste in films.
        </p>
        <div className={styles.processCard}>
          <h3 className={styles.processTitle}>Here's how it works:</h3>
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
          <button
            key="all"
            onClick={() => setSelectedGenre("All")}
            className={`${styles.filterButton} ${selectedGenre === "All" ? styles.active : ""}`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(normalizeGenreName(genre.name))}
              className={`${styles.filterButton} ${selectedGenre === normalizeGenreName(genre.name) ? styles.active : ""}`}
            >
              {genre.name}
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
          {filteredMovies.map((movie, idx) => {
            const movieRating = getMovieRating(movie.tmdbId);
            // Try posterUrl, fallback to posterPath (if present), else placeholder
            let posterSrc = movie.posterUrl;
            if (!posterSrc && (movie as any).posterPath) {
              posterSrc = `https://image.tmdb.org/t/p/w500/${(movie as any).posterPath}`;
            }
            return (
              <div
                key={movie.tmdbId || (movie as any).id || idx}
                className={`${styles.movieCard} ${
                  movieRating.watched && movieRating.rating > 0 ? styles.selected : ""
                }`}
              >
                <div className={styles.moviePosterContainer}>
                  <img
                    src={
                      posterSrc ||
                      "https://via.placeholder.com/300x450/1e293b/64748b?text=Movie+Poster"
                    }
                    alt={movie.title}
                    className={styles.moviePoster}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/300x450/1e293b/64748b?text=Movie+Poster";
                    }}
                  />
                  <div className={styles.movieOverlay}>
                    <div className={styles.movieRating}>
                      <Star className={styles.imdbStar} />
                      <span>{movie.voteAverage}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <div className={styles.movieMeta}>
                    <span className={styles.movieYear}>{movie.year}</span>
                    <span className={styles.movieGenres}>
                      {movie.genre.slice(0, 2).join(", ")}
                    </span>
                  </div>
                  <div className={styles.ratingSection}>
                    <div className={styles.watchedCheckbox}>
                      <input
                        type="checkbox"
                        id={`watched-${movie.tmdbId}`}
                        checked={movieRating.watched}
                        onChange={(e) =>
                          handleWatchedToggle(movie.tmdbId, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`watched-${movie.tmdbId}`}
                        className={styles.watchedLabel}
                      >
                        I've watched this
                      </label>
                    </div>
                    <div className={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`${styles.star} ${
                            star <= movieRating.rating ? styles.filled : ""
                          } ${!movieRating.watched ? styles.disabled : ""}`}
                          onClick={() => {
                            if (movieRating.watched) {
                              handleMovieRating(movie.tmdbId, star);
                            }
                          }}
                          fill={
                            star <= movieRating.rating ? "currentColor" : "none"
                          }
                        />
                      ))}
                    </div>
                    <div className={styles.ratingLabel}>
                      {movieRating.watched
                        ? movieRating.rating > 0
                          ? `${movieRating.rating}/5 stars`
                          : "Click to rate"
                        : "Mark as watched to rate"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
          Our algorithm is now learning your preferences. You can fine-tune your
          recommendations anytime in your profile settings.
        </p>
        <div className={styles.completionCard}>
          <h3 className={styles.completionCardTitle}>What happens next?</h3>
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
                {["Drama", "Sci-Fi", "Action"].map((genre) => (
                  <span key={genre} className={styles.tasteGenre}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.tasteItem}>
              <span className={styles.tasteLabel}>Average Rating</span>
              <span className={styles.tasteValue}>
                {ratedMoviesCount > 0
                  ? (
                      ratings
                        .filter((r) => r.watched && r.rating > 0)
                        .reduce((sum, r) => sum + r.rating, 0) /
                      ratedMoviesCount
                    ).toFixed(1)
                  : "0.0"}{" "}
                / 5.0
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
        return "Let's Get Started";
      case 2:
        return "Rate Popular Movies";
      case 3:
        return "You're All Set!";
      default:
        return "Welcome";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Help us understand your movie preferences to get personalized recommendations";
      case 2:
        return `Rate movies you've watched to help us understand your taste (${ratedMoviesCount}/${minRatings} minimum)`;
      case 3:
        return "Your profile is ready! Let's start discovering amazing movies together.";
      default:
        return "";
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
          <button onClick={handleExit} className={styles.exitButton}>
            <X size={20} />
          </button>
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
                <span className={canContinue ? styles.complete : ""}>
                  {ratedMoviesCount >= minRatings
                    ? `✓ ${ratedMoviesCount} movies rated`
                    : `${ratedMoviesCount}/${minRatings} movies rated`}
                </span>
              )}
            </div>
            <div className={styles.actionButtons}>
              {currentStep > 1 && (
                <button onClick={handleBack} className={styles.backButton}>
                  <ChevronLeft className={styles.buttonIcon} />
                  Back
                </button>
              )}
              <button onClick={handleSkip} className={styles.skipButton}>
                {currentStep === 1 ? "Skip for now" : "Skip this step"}
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

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className={styles.modalOverlay} onClick={cancelExit}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Exit Onboarding?</h3>
            <p>
              Are you sure you want to exit? Your progress will be saved, but
              you can always come back to complete the setup.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={cancelExit}
                className={styles.modalButtonSecondary}
              >
                Continue Onboarding
              </button>
              <button
                onClick={confirmExit}
                className={styles.modalButtonPrimary}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div className={styles.modalOverlay} onClick={cancelSkip}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Skip Movie Rating?</h3>
            <p>
              You've rated {ratedMoviesCount} movies. Skipping now means you'll
              get basic recommendations. You can always rate more movies later
              for better suggestions.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={cancelSkip}
                className={styles.modalButtonSecondary}
              >
                Continue Rating
              </button>
              <button
                onClick={confirmSkip}
                className={styles.modalButtonPrimary}
              >
                Skip & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
