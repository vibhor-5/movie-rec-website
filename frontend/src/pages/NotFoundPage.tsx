import React from 'react';
import { Film, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Film className="mx-auto h-16 w-16 text-blue-800" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-700">
              The movie you're searching for might be hiding in our recommendations!
            </p>
            <div className="w-full max-w-xs">
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Search for a movie..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;