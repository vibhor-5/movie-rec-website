import React, { useState } from 'react';
import { Search, Filter, Sliders } from 'lucide-react';
import MovieGrid from '../../components/movie/MovieGrid/MovieGrid';
import styles from './Movies.module.css';

const Movies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Discover Movies
          </h1>
          <p className="text-xl text-blue-100">
            Find your next favorite film from our curated collection
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  Filters
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Sliders className="h-5 w-5 mr-2" />
                  Sort
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year Range</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="number"
                        placeholder="From"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="To"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                      <option>Any Rating</option>
                      <option>8+ Stars</option>
                      <option>7+ Stars</option>
                      <option>6+ Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                      <option>Any Language</option>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movie Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <MovieGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies; 