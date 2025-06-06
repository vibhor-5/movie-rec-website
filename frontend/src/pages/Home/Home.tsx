import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Film, BookOpen, Heart } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
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
  const { isAuthenticated } = useAuthContext();
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
            title: "The Shawshank Redemption",
            posterPath: "https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=500",
            releaseDate: "1994-09-23",
            voteAverage: 9.3,
            genres: ["Drama"],
            overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
          },
          {
            id: 2,
            title: "The Godfather",
            posterPath: "https://images.pexels.com/photos/7234243/pexels-photo-7234243.jpeg?auto=compress&cs=tinysrgb&w=500",
            releaseDate: "1972-03-24",
            voteAverage: 9.2,
            genres: ["Crime", "Drama"],
            overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
          },
          {
            id: 3,
            title: "The Dark Knight",
            posterPath: "https://images.pexels.com/photos/8118880/pexels-photo-8118880.jpeg?auto=compress&cs=tinysrgb&w=500",
            releaseDate: "2008-07-18",
            voteAverage: 9.0,
            genres: ["Action", "Crime", "Drama"],
            overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."
          },
          {
            id: 4,
            title: "Pulp Fiction",
            posterPath: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
            releaseDate: "1994-10-14",
            voteAverage: 8.9,
            genres: ["Crime", "Drama"],
            overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
          },
          {
            id: 5,
            title: "Inception",
            posterPath: "https://images.pexels.com/photos/8118890/pexels-photo-8118890.jpeg?auto=compress&cs=tinysrgb&w=500",
            releaseDate: "2010-07-16",
            voteAverage: 8.8,
            genres: ["Action", "Sci-Fi", "Thriller"],
            overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea."
          }
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

  // Show different content based on authentication status
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white">
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
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How MovieRec Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform combines multiple recommendation algorithms to find the perfect movies for you while explaining the technology behind it.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Recommendations</h3>
                <p className="text-gray-600">
                  Rate movies you've watched and receive tailored recommendations based on your unique taste profile.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Insights</h3>
                <p className="text-gray-600">
                  Learn how recommendation algorithms work with interactive visualizations and simple explanations.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Film className="w-6 h-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Algorithms</h3>
                <p className="text-gray-600">
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