import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Info, Plus, Eye, ArrowRight, Star, Clock } from 'lucide-react';

// Mock data for recommendations
const mockMovies = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    poster: 'https://images.pexels.com/photos/8118890/pexels-photo-8118890.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 8.8,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    year: 1994,
    poster: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 9.3,
    genres: ['Drama', 'Crime'],
  },
  {
    id: 3,
    title: 'The Dark Knight',
    year: 2008,
    poster: 'https://images.pexels.com/photos/8118880/pexels-photo-8118880.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 9.0,
    genres: ['Action', 'Crime', 'Drama'],
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    year: 1994,
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 8.9,
    genres: ['Crime', 'Drama'],
  },
  {
    id: 5,
    title: 'The Godfather',
    year: 1972,
    poster: 'https://images.pexels.com/photos/7234243/pexels-photo-7234243.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 9.2,
    genres: ['Crime', 'Drama'],
  },
  {
    id: 6,
    title: 'Fight Club',
    year: 1999,
    poster: 'https://images.pexels.com/photos/2549565/pexels-photo-2549565.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 8.8,
    genres: ['Drama', 'Thriller'],
  },
];

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: number;
    poster: string;
    rating: number;
    genres: string[];
  };
  withReason?: boolean;
  reason?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, withReason = false, reason = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[2/3] bg-gray-200 relative">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm">{movie.rating}</span>
              </div>
              <span className="text-white text-sm">{movie.year}</span>
            </div>
            
            <div className="flex space-x-2 mb-3">
              {movie.genres.slice(0, 2).map((genre, index) => (
                <span key={index} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-white">
        <h3 className="font-medium text-gray-900 truncate" title={movie.title}>
          {movie.title}
        </h3>
        
        {withReason && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500 line-clamp-2">
              {reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  movies: any[];
  withReasons?: boolean;
  reasons?: string[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  title, 
  subtitle, 
  movies,
  withReasons = false,
  reasons = []
}) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <button className="inline-flex items-center text-sm font-medium text-blue-800 hover:text-blue-900">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie}
            withReason={withReasons}
            reason={reasons[index] || ''}
          />
        ))}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const collaborativeReasons = [
    "90% of users who liked Inception also enjoyed this film",
    "Based on the ratings of users with similar tastes to yours",
    "Your ratings pattern closely matches fans of this movie",
    "Users who rated The Dark Knight highly also rated this movie",
    "Strong correlation with your highly rated sci-fi films",
    "Popular among users with your genre preferences"
  ];

  const contentBasedReasons = [
    "Features similar themes and visual style to Inception",
    "Directed by Christopher Nolan, whose films you rate highly",
    "Contains similar plot elements to your favorite movies",
    "Matches your preference for psychological thrillers",
    "Shares multiple cast members with films you've enjoyed",
    "Aligns with your interest in complex narratives"
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Movie Recommendations</h1>
          <p className="text-gray-600 mt-1">
            Personalized suggestions based on your preferences and ratings
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-blue-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Movies Watched</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="bg-teal-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-teal-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Watchlist</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recommendation Algorithm</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-800 text-white rounded-lg">
              Hybrid (Recommended)
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Collaborative Filtering
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Content Based
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Trending
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="font-medium">Currently using:</span> Hybrid approach combining collaborative and content-based methods
              <button className="ml-2 text-blue-800 hover:text-blue-900 underline">
                Learn more
              </button>
            </p>
          </div>
        </div>
        
        {/* Collaborative Filtering Section */}
        <MovieCarousel
          title="Users Like You Also Enjoyed"
          subtitle="Based on the ratings of users with similar preferences"
          movies={mockMovies}
          withReasons={true}
          reasons={collaborativeReasons}
        />
        
        {/* Content Based Section */}
        <MovieCarousel
          title="Because You Liked Inception"
          subtitle="Films with similar themes, directors, or style"
          movies={mockMovies.slice().reverse()}
          withReasons={true}
          reasons={contentBasedReasons}
        />
        
        {/* Trending Section */}
        <MovieCarousel
          title="Trending This Week"
          subtitle="Popular films among all users"
          movies={mockMovies.slice(2, 8).concat(mockMovies.slice(0, 2))}
        />
        
        {/* Surprise Me Section */}
        <MovieCarousel
          title="Surprise Me"
          subtitle="Diverse recommendations to expand your horizons"
          movies={mockMovies.slice(1, 7)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;