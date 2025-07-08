import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Film, BookOpen, Heart } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { getRecommendations } from '../../api/recommendations';
import MovieCarousel from '../../components/common/MovieCarousel/MovieCarousel';
import MovieOverlay from '../../components/common/MovieOverlay/MovieOverlay';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Home.module.css';
import { getPopularMovies } from '../../api/general';

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

// Helper to map backend movie to frontend MovieCarousel/MovieCard shape
const mapToCarouselMovie = (movie: any, idx: number = 0) => ({
  id: movie.tmdbId || movie.id || idx,
  title: movie.title,
  posterPath: movie.posterUrl || '',
  releaseDate: movie.releaseDate || '',
  voteAverage: movie.voteAverage || 0,
  genres: movie.genre || movie.genres || [],
  overview: movie.overview || '',
  year: movie.year || null,
  runtime: movie.runtime,
  imdbId: movie.imdbId || null,
  tmdbId: movie.tmdbId || null,
});

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Movie[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPopularMovies(1);
        let movieList: any[] = [];
        if (response && typeof response === 'object' && 'results' in response) {
          movieList = (response as any).results;
        } else if (Array.isArray(response)) {
          movieList = response;
        }
        setFeaturedMovies(movieList.map(mapToCarouselMovie));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPersonalizedRecommendations = async () => {
      if (!isAuthenticated) return;
      setIsLoadingRecommendations(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response: any = await getRecommendations(token, 10);
          if (response && response.data && Array.isArray(response.data.recommendations)) {
            setPersonalizedRecommendations(response.data.recommendations.map(mapToCarouselMovie));
          } else {
            setPersonalizedRecommendations([]);
          }
        }
      } catch (error) {
        console.error('Error fetching personalized recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchPersonalizedRecommendations();
  }, [isAuthenticated]);

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(mapToCarouselMovie(movie));
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedMovie(null);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    console.log('Added to watchlist:', movie.title);
  };

  const handleMarkAsWatched = (movie: Movie) => {
    console.log('Marked as watched:', movie.title);
  };

  const handleRateMovie = (movie: Movie, rating: number) => {
    console.log('Rated movie:', movie.title, 'Rating:', rating);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show different content based on authentication status
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Discover Your Next Favorite Film
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                MovieRec uses advanced algorithms to find movies you'll love. Learn how it works while getting personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/educational"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                >
                  Learn How It Works
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">How MovieRec Works</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Our platform combines multiple recommendation algorithms to find the perfect movies for you while explaining the technology behind it.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-slate-700 rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Personalized Recommendations</h3>
                <p className="text-slate-300">
                  Rate movies you've watched and receive tailored recommendations based on your unique taste profile.
                </p>
              </div>

              <div className="bg-slate-700 rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Educational Insights</h3>
                <p className="text-slate-300">
                  Learn how recommendation algorithms work with interactive visualizations and simple explanations.
                </p>
              </div>

              <div className="bg-slate-700 rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Film className="w-6 h-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Multiple Algorithms</h3>
                <p className="text-slate-300">
                  Compare different recommendation techniques and understand why specific movies are suggested to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-800 to-teal-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Next Favorite Film?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of users who are discovering new films and learning about recommendation algorithms.
            </p>
            <Link
              to="/auth"
              className="px-8 py-4 bg-white text-blue-800 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 inline-flex items-center justify-center text-lg"
            >
              Get Started Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated user view
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <MovieCarousel
            title="Featured Movies"
            movies={featuredMovies}
            onMovieClick={handleMovieSelect}
          />
        </section>

        {personalizedRecommendations.length > 0 && (
          <section className={styles.hero}>
            <MovieCarousel
              title="Recommended for You"
              movies={personalizedRecommendations}
              isLoading={isLoadingRecommendations}
              onMovieClick={handleMovieSelect}
            />
          </section>
        )}

        <section className={styles.hero}>
          <MovieCarousel
            title="Popular Movies"
            movies={featuredMovies}
            onMovieClick={handleMovieSelect}
          />
        </section>
      </main>

      {/* Movie Overlay Modal */}
      {selectedMovie && (
        <MovieOverlay
          movie={selectedMovie}
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          onAddToWatchlist={handleAddToWatchlist}
          onMarkAsWatched={handleMarkAsWatched}
          onRate={handleRateMovie}
        />
      )}
    </div>
  );
};

export default Home;