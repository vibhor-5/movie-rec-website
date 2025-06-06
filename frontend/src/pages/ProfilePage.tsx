import React, { useState } from 'react';
import { User, Film, Clock, Settings, Eye, Star, Filter, ChevronRight, Save, RefreshCw } from 'lucide-react';

// Mock movie data
const watchedMovies = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    poster: 'https://images.pexels.com/photos/8118890/pexels-photo-8118890.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 5,
    watchDate: '2023-05-15',
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    year: 1994,
    poster: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 5,
    watchDate: '2023-04-02',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    year: 2008,
    poster: 'https://images.pexels.com/photos/8118880/pexels-photo-8118880.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4,
    watchDate: '2023-03-20',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    year: 1994,
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4,
    watchDate: '2023-03-05',
  },
];

const watchlistMovies = [
  {
    id: 5,
    title: 'The Godfather',
    year: 1972,
    poster: 'https://images.pexels.com/photos/7234243/pexels-photo-7234243.jpeg?auto=compress&cs=tinysrgb&w=500',
    addedDate: '2023-05-10',
  },
  {
    id: 6,
    title: 'Fight Club',
    year: 1999,
    poster: 'https://images.pexels.com/photos/2549565/pexels-photo-2549565.jpeg?auto=compress&cs=tinysrgb&w=500',
    addedDate: '2023-05-05',
  },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [sliderValues, setSliderValues] = useState({
    action: 60,
    comedy: 40,
    drama: 80,
    horror: 30,
    scifi: 75,
  });

  const handleSliderChange = (genre: string, value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [genre]: value
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-4xl font-bold mb-4 md:mb-0 md:mr-6">
              J
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-blue-100">Movie enthusiast since 2023</p>
              <div className="mt-3 flex items-center justify-center md:justify-start">
                <div className="flex items-center mr-4">
                  <Film className="h-4 w-4 mr-1" />
                  <span className="text-sm">24 watched</span>
                </div>
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">12 in watchlist</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                  <span className="text-sm">4.2 avg rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('watched')}
              className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'watched'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="h-5 w-5 mr-2" />
              Watched Movies
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'watchlist'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              Watchlist
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value="John Doe"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value="john.doe@example.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value="************"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="pt-2">
                    <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive emails about new recommendations</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="email-toggle" defaultChecked className="sr-only peer" />
                      <label
                        htmlFor="email-toggle"
                        className="block h-6 rounded-full overflow-hidden bg-gray-300 cursor-pointer peer-checked:bg-blue-800"
                      >
                        <span className="absolute inset-y-0 left-0 block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
                      <p className="text-sm text-gray-500">Weekly summary of new recommendations</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="digest-toggle" className="sr-only peer" />
                      <label
                        htmlFor="digest-toggle"
                        className="block h-6 rounded-full overflow-hidden bg-gray-300 cursor-pointer peer-checked:bg-blue-800"
                      >
                        <span className="absolute inset-y-0 left-0 block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Similar Movies</h3>
                      <p className="text-sm text-gray-500">Get notified about similar movies to your favorites</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="similar-toggle" defaultChecked className="sr-only peer" />
                      <label
                        htmlFor="similar-toggle"
                        className="block h-6 rounded-full overflow-hidden bg-gray-300 cursor-pointer peer-checked:bg-blue-800"
                      >
                        <span className="absolute inset-y-0 left-0 block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Top Genres</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 w-20">Drama</span>
                        <div className="flex-grow mx-2 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-800 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">80%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 w-20">Sci-Fi</span>
                        <div className="flex-grow mx-2 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-800 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 w-20">Action</span>
                        <div className="flex-grow mx-2 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-800 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Favorite Directors</span>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Christopher Nolan</li>
                      <li>Martin Scorsese</li>
                      <li>Quentin Tarantino</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Viewing Activity</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 rounded-sm ${
                            [3, 5, 10, 14, 17, 20, 25].includes(i)
                              ? 'bg-blue-800'
                              : [2, 9, 13, 19, 24].includes(i)
                              ? 'bg-blue-600'
                              : [1, 8, 12, 18, 23].includes(i)
                              ? 'bg-blue-400'
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">4 weeks ago</span>
                      <span className="text-xs text-gray-500">Today</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recommendation Quality</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-blue-800 stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset="50.24"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        transform="rotate(-90 50 50)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">80%</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-600">
                  Based on your feedback for 24 recommendations
                </p>
                <div className="mt-4 flex justify-center">
                  <button className="inline-flex items-center text-sm font-medium text-blue-800 hover:text-blue-900">
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Refresh Recommendations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Watched Movies Tab */}
        {activeTab === 'watched' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Watched Movies</h2>
              <div className="flex items-center">
                <div className="mr-2">
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                    <option>Recently Watched</option>
                    <option>Highest Rated</option>
                    <option>Oldest First</option>
                  </select>
                </div>
                <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Filter className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {watchedMovies.map((movie) => (
                <div key={movie.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-[2/3] bg-gray-200 relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded">
                      {movie.year}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate" title={movie.title}>
                      {movie.title}
                    </h3>
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < movie.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(movie.watchDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Load More
              </button>
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Watchlist</h2>
              <div className="flex items-center">
                <div className="mr-2">
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                    <option>Recently Added</option>
                    <option>Release Year</option>
                    <option>Alphabetical</option>
                  </select>
                </div>
                <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Filter className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {watchlistMovies.map((movie) => (
                <div key={movie.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-[2/3] bg-gray-200 relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded">
                      {movie.year}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button className="bg-white text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50">
                        Mark as Watched
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate" title={movie.title}>
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Added{' '}
                        {new Date(movie.addedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <button className="text-gray-500 hover:text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Find Movies to Add</h3>
              <p className="text-gray-600 mb-4">
                Discover more films to add to your watchlist from our personalized recommendations.
              </p>
              <button className="inline-flex items-center text-blue-800 font-medium hover:text-blue-900">
                Explore Recommendations
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Genre Preferences</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Adjust the sliders to indicate your interest in each genre. This helps us tailor recommendations to your taste.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Action & Adventure</label>
                      <span className="text-sm text-gray-500">{sliderValues.action}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValues.action}
                      onChange={(e) => handleSliderChange('action', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Comedy</label>
                      <span className="text-sm text-gray-500">{sliderValues.comedy}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValues.comedy}
                      onChange={(e) => handleSliderChange('comedy', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Drama</label>
                      <span className="text-sm text-gray-500">{sliderValues.drama}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValues.drama}
                      onChange={(e) => handleSliderChange('drama', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Horror</label>
                      <span className="text-sm text-gray-500">{sliderValues.horror}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValues.horror}
                      onChange={(e) => handleSliderChange('horror', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Science Fiction</label>
                      <span className="text-sm text-gray-500">{sliderValues.scifi}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValues.scifi}
                      onChange={(e) => handleSliderChange('scifi', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-6 flex">
                  <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 inline-flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Content Filters</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Set your content preferences to filter recommendations by ratings and other criteria.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Rating</label>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full">G</button>
                      <button className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full">PG</button>
                      <button className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full">PG-13</button>
                      <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full">R</button>
                      <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full">NC-17</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Release Year Range</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        placeholder="1920"
                        min="1900"
                        max="2023"
                        defaultValue="1970"
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                      <span className="mx-2 text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="2023"
                        min="1900"
                        max="2023"
                        defaultValue="2023"
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum IMDb Rating</label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                      <option>No minimum</option>
                      <option>At least 6.0</option>
                      <option selected>At least 7.0</option>
                      <option>At least 8.0</option>
                      <option>At least 9.0</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Algorithm Preferences</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Choose which recommendation algorithm works best for you.
                </p>

                <div className="space-y-3">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="hybrid"
                        name="algorithm"
                        type="radio"
                        defaultChecked
                        className="h-4 w-4 border-gray-300 text-blue-800 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="hybrid" className="font-medium text-gray-700">
                        Hybrid Approach (Recommended)
                      </label>
                      <p className="text-gray-500">
                        Combines collaborative and content-based methods for balanced recommendations
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="collaborative"
                        name="algorithm"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-blue-800 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="collaborative" className="font-medium text-gray-700">
                        Collaborative Filtering
                      </label>
                      <p className="text-gray-500">
                        Based on what similar users enjoy, better for discovering unexpected films
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="content"
                        name="algorithm"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-blue-800 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="content" className="font-medium text-gray-700">
                        Content-Based Filtering
                      </label>
                      <p className="text-gray-500">
                        Recommends films similar to ones you already like, more predictable results
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fine-tune Hybrid Algorithm</h3>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Content-Based</span>
                    <div className="flex-grow mx-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Collaborative</span>
                  </div>
                </div>

                <div className="mt-6 flex">
                  <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 inline-flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Apply & Refresh
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Control how your data is used to generate recommendations.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Share Ratings Anonymously</h3>
                      <p className="text-sm text-gray-500">
                        Improve recommendations for everyone by sharing your anonymized ratings
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="share-toggle" defaultChecked className="sr-only peer" />
                      <label
                        htmlFor="share-toggle"
                        className="block h-6 rounded-full overflow-hidden bg-gray-300 cursor-pointer peer-checked:bg-blue-800"
                      >
                        <span className="absolute inset-y-0 left-0 block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Public Profile</h3>
                      <p className="text-sm text-gray-500">
                        Allow others to see your watched movies and ratings
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="public-toggle" className="sr-only peer" />
                      <label
                        htmlFor="public-toggle"
                        className="block h-6 rounded-full overflow-hidden bg-gray-300 cursor-pointer peer-checked:bg-blue-800"
                      >
                        <span className="absolute inset-y-0 left-0 block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Personalized Learning</h3>
                      <p className="text-sm text-gray-500">
                        Allow the algorithm to learn from your behavior and improve over time
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="learning-toggle" defaultChecked className="sr-only peer" />
                      <label
                        htmlFor="learning-toggle"
                        className="block h-6 rounded-full overflow-hidden bg-gray-300 cursor-pointer peer-checked:bg-blue-800"
                      >
                        <span className="absolute inset-y-0 left-0 block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex">
                  <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200">
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;