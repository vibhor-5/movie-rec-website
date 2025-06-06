import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import MovieCarousel from '../../components/common/MovieCarousel/MovieCarousel';
import RecommendationSection from '../../components/dashboard/RecommendationSection/RecommendationSection';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Home.module.css';

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  overview: string;
}

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState({
    collaborativeMovies: [] as Movie[],
    contentBasedMovies: [] as Movie[],
    hybridMovies: [] as Movie[],
    trendingMovies: [] as Movie[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        // Simulated data for now
        const mockMovies: Movie[] = [
          {
            id: 1,
            title: "Sample Movie 1",
            posterPath: "/path/to/poster1.jpg",
            releaseDate: "2024-03-20",
            voteAverage: 8.5,
            genres: ["Action", "Drama"],
            overview: "A sample movie description"
          },
          // Add more mock movies as needed
        ];

        setFeaturedMovies(mockMovies);
        setRecommendations({
          collaborativeMovies: mockMovies,
          contentBasedMovies: mockMovies,
          hybridMovies: mockMovies,
          trendingMovies: mockMovies
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    // TODO: Implement movie selection logic
    console.log('Selected movie:', movie);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <MovieCarousel
            title="Featured Movies"
            movies={featuredMovies}
            onMovieSelect={handleMovieSelect}
          />
        </section>

        <RecommendationSection
          collaborativeMovies={recommendations.collaborativeMovies}
          contentBasedMovies={recommendations.contentBasedMovies}
          hybridMovies={recommendations.hybridMovies}
          trendingMovies={recommendations.trendingMovies}
          onMovieSelect={handleMovieSelect}
        />
      </main>
    </div>
  );
};

export default Home; 