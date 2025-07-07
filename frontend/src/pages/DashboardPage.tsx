import React, { useState, useEffect } from 'react';
import { Film, Clock, Star, Info, RefreshCw } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { getRecommendations, getTFIDFRecommendations } from '../api/recommendations';
import MovieCarousel from '../components/common/MovieCarousel/MovieCarousel';
import LoadingSpinner from '../components/common/LoadingSpinner/LoadingSpinner';
import styles from './DashboardPage.module.css';

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  genre: string[];
  year: number | null;
  posterUrl: string | null;
  voteAverage: number;
  overview: string;
  releaseDate: string | null;
  score: number;
  rank: number;
  algorithm?: string;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('collaborative');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [tfidfRecommendations, setTfidfRecommendations] = useState<Movie[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingTFIDF, setIsLoadingTFIDF] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [tfidfError, setTfidfError] = useState<string | null>(null);
  const [userEmbedding, setUserEmbedding] = useState<number[] | null>(null);

  const algorithms = [
    { id: 'collaborative', name: 'Collaborative Filtering' },
    { id: 'content', name: 'Content-Based' },
    { id: 'hybrid', name: 'Hybrid Approach' },
    { id: 'tfidf', name: 'TF-IDF Content-Based' }
  ];

  // Mock data for recently watched movies
  const recentlyWatched = [
    { id: 1, title: 'The Shawshank Redemption', rating: 5, date: '2024-03-15' },
    { id: 2, title: 'The Godfather', rating: 5, date: '2024-03-14' },
    { id: 3, title: 'The Dark Knight', rating: 4, date: '2024-03-13' },
    { id: 4, title: 'Pulp Fiction', rating: 4, date: '2024-03-12' },
    { id: 5, title: 'Forrest Gump', rating: 5, date: '2024-03-11' }
  ];

  const fetchRecommendations = async () => {
    if (!isAuthenticated) return;

    setIsLoadingRecommendations(true);
    setRecommendationError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await getRecommendations(token, 20);
      setRecommendations(response.data.recommendations);
      setUserEmbedding(response.data.user_embedding);
    } catch (error: any) {
      console.error('Failed to fetch recommendations:', error);
      
      if (error.response?.data?.code === 'NO_PREFERENCES') {
        setRecommendationError('Please rate some movies first to get personalized recommendations.');
      } else {
        setRecommendationError('Failed to load recommendations. Please try again.');
      }
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const fetchTFIDFRecommendations = async () => {
    if (!isAuthenticated) return;

    setIsLoadingTFIDF(true);
    setTfidfError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await getTFIDFRecommendations(token, 20);
      setTfidfRecommendations(response.data.recommendations);
    } catch (error: any) {
      console.error('Failed to fetch TF-IDF recommendations:', error);
      
      if (error.response?.data?.code === 'NO_PREFERENCES') {
        setTfidfError('Please rate some movies first to get TF-IDF recommendations.');
      } else {
        setTfidfError('Failed to load TF-IDF recommendations. Please try again.');
      }
    } finally {
      setIsLoadingTFIDF(false);
    }
  };
  useEffect(() => {
    fetchRecommendations();
    fetchTFIDFRecommendations();
  }, [isAuthenticated]);

  const handleRefreshRecommendations = () => {
    fetchRecommendations();
    fetchTFIDFRecommendations();
  };

  // Transform recommendations for MovieCarousel
  const transformedRecommendations = recommendations.map(movie => ({
    id: movie.tmdbId,
    title: movie.title,
    posterPath: movie.posterUrl,
    releaseDate: movie.releaseDate || '',
    voteAverage: movie.voteAverage,
    genres: movie.genre,
    overview: movie.overview
  }));

  const transformedTFIDFRecommendations = tfidfRecommendations.map(movie => ({
    id: movie.tmdbId,
    title: movie.title,
    posterPath: movie.posterUrl,
    releaseDate: movie.releaseDate || '',
    voteAverage: movie.voteAverage,
    genres: movie.genre,
    overview: movie.overview
  }));
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Your Dashboard</h1>
          <p className={styles.subtitle}>Welcome back{user?.name ? `, ${user.name}` : ''}! Here's your personalized movie experience.</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Film className="h-6 w-6 text-blue-800" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Movies Watched</p>
              <p className={styles.statValue}>42</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Clock className="h-6 w-6 text-blue-800" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>In Watchlist</p>
              <p className={styles.statValue}>15</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Star className="h-6 w-6 text-blue-800" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Average Rating</p>
              <p className={styles.statValue}>4.2</p>
            </div>
          </div>
        </div>

        <div className={styles.algorithmCard}>
          <div className={styles.algorithmHeader}>
            <h2 className={styles.algorithmTitle}>Recommendation Algorithm</h2>
            <button
              className={styles.detailsButton}
              onClick={() => setShowAlgorithmDetails(!showAlgorithmDetails)}
            >
              {showAlgorithmDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className={styles.algorithmButtons}>
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                className={`${styles.algorithmButton} ${
                  selectedAlgorithm === algorithm.id ? styles.active : styles.inactive
                }`}
                onClick={() => setSelectedAlgorithm(algorithm.id)}
              >
                {algorithm.name}
              </button>
            ))}
          </div>

          {showAlgorithmDetails && (
            <div className={styles.algorithmDetails}>
              <p className="text-sm text-gray-600">
                Our recommendation system uses advanced machine learning algorithms to suggest movies
                based on your preferences and viewing history. The selected algorithm will be used to
                generate personalized recommendations.
              </p>
              {userEmbedding && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Your Taste Profile</h4>
                  <p className="text-xs text-blue-600">
                    We've learned your preferences and created a unique taste profile with {userEmbedding.length} dimensions.
                    This helps us find movies that match your specific interests.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.recommendationsCard}>
          <div className={styles.recommendationsContent}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={styles.recommendationsTitle}>Recommended for You</h2>
              <button
                onClick={handleRefreshRecommendations}
                disabled={isLoadingRecommendations}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-800 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoadingRecommendations ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="large" />
                <span className="ml-3 text-gray-600">Loading personalized recommendations...</span>
              </div>
            ) : recommendationError ? (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <Info className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">No Recommendations Available</h3>
                  <p className="text-yellow-700 mb-4">{recommendationError}</p>
                  {recommendationError.includes('rate some movies') && (
                    <a
                      href="/onboarding"
                      className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Rate Movies Now
                    </a>
                  )}
                </div>
              </div>
            ) : recommendations.length > 0 ? (
              <div>
                <div className="mb-4 text-sm text-gray-600">
                  Based on your ratings, we found {recommendations.length} movies you might love
                </div>
                <MovieCarousel 
                  title="AI-Powered Recommendations" 
                  movies={transformedRecommendations}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600">Rate some movies to get personalized recommendations!</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.recommendationsCard}>
          <div className={styles.recommendationsContent}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={styles.recommendationsTitle}>TF-IDF Content-Based Recommendations</h2>
              <button
                onClick={fetchTFIDFRecommendations}
                disabled={isLoadingTFIDF}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-800 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingTFIDF ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoadingTFIDF ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="large" />
                <span className="ml-3 text-gray-600">Loading content-based recommendations...</span>
              </div>
            ) : tfidfError ? (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <Info className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">No TF-IDF Recommendations Available</h3>
                  <p className="text-yellow-700 mb-4">{tfidfError}</p>
                </div>
              </div>
            ) : tfidfRecommendations.length > 0 ? (
              <div>
                <div className="mb-4 text-sm text-gray-600">
                  Based on movie content and tags, we found {tfidfRecommendations.length} similar movies
                </div>
                <MovieCarousel 
                  title="Content-Based Recommendations" 
                  movies={transformedTFIDFRecommendations}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No TF-IDF Recommendations Yet</h3>
                <p className="text-gray-600">Rate some movies to get content-based recommendations!</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.recentlyWatchedCard}>
          <div className={styles.recentlyWatchedContent}>
            <h2 className={styles.recentlyWatchedTitle}>Recently Watched</h2>
            <div className={styles.movieGrid}>
              {recentlyWatched.map((movie) => (
                <div key={movie.id} className={styles.movieCard}>
                  <div className={styles.moviePoster} />
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <div className={styles.movieRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`${styles.starIcon} ${
                          i < movie.rating ? styles.filled : styles.empty
                        }`}
                      />
                    ))}
                    <span className={styles.watchDate}>{movie.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;