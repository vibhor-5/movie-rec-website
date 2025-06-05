import React, { useState } from 'react';
import { Film, Clock, Star, Info } from 'lucide-react';
import styles from './DashboardPage.module.css';
import MovieCarousel from '../components/common/MovieCarousel/MovieCarousel';

const DashboardPage: React.FC = () => {
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('collaborative');

  const algorithms = [
    { id: 'collaborative', name: 'Collaborative Filtering' },
    { id: 'content', name: 'Content-Based' },
    { id: 'hybrid', name: 'Hybrid Approach' },
    { id: 'contextual', name: 'Contextual' }
  ];

  // Mock data for recently watched movies
  const recentlyWatched = [
    { id: 1, title: 'The Shawshank Redemption', rating: 5, date: '2024-03-15' },
    { id: 2, title: 'The Godfather', rating: 5, date: '2024-03-14' },
    { id: 3, title: 'The Dark Knight', rating: 4, date: '2024-03-13' },
    { id: 4, title: 'Pulp Fiction', rating: 4, date: '2024-03-12' },
    { id: 5, title: 'Forrest Gump', rating: 5, date: '2024-03-11' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Your Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your personalized movie experience.</p>
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
            </div>
          )}
        </div>

        <div className={styles.recommendationsCard}>
          <div className={styles.recommendationsContent}>
            <h2 className={styles.recommendationsTitle}>Recommended for You</h2>
            <MovieCarousel title="Recommended for You" movies={[]} />
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