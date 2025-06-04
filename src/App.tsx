import { useState } from 'react';
import { Film, Home, User, BookOpen, Search, Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import EducationalPage from './pages/EducationalPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'educational':
        return <EducationalPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <NotFoundPage />;
    }
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Film className="w-8 h-8 text-blue-800" />
              <span className="ml-2 text-xl font-semibold text-blue-900">FilmSage</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavButton 
                icon={<Home size={20} />} 
                label="Home" 
                isActive={currentPage === 'home'} 
                onClick={() => handleNavigation('home')} 
              />
              <NavButton 
                icon={<Film size={20} />} 
                label="Discover" 
                isActive={currentPage === 'dashboard'} 
                onClick={() => handleNavigation('dashboard')} 
              />
              <NavButton 
                icon={<BookOpen size={20} />} 
                label="Learn" 
                isActive={currentPage === 'educational'} 
                onClick={() => handleNavigation('educational')} 
              />
              <NavButton 
                icon={<User size={20} />} 
                label="Profile" 
                isActive={currentPage === 'profile'} 
                onClick={() => handleNavigation('profile')} 
              />
            </nav>

            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu, show/hide based on menu state */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <MobileNavButton 
                icon={<Home size={20} />} 
                label="Home" 
                isActive={currentPage === 'home'} 
                onClick={() => handleNavigation('home')} 
              />
              <MobileNavButton 
                icon={<Film size={20} />} 
                label="Discover" 
                isActive={currentPage === 'dashboard'} 
                onClick={() => handleNavigation('dashboard')} 
              />
              <MobileNavButton 
                icon={<BookOpen size={20} />} 
                label="Learn" 
                isActive={currentPage === 'educational'} 
                onClick={() => handleNavigation('educational')} 
              />
              <MobileNavButton 
                icon={<User size={20} />} 
                label="Profile" 
                isActive={currentPage === 'profile'} 
                onClick={() => handleNavigation('profile')} 
              />
              
              {/* Mobile Search */}
              <div className="px-4 pb-2 pt-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center">
              <Film className="w-6 h-6 text-blue-800" />
              <span className="ml-2 text-lg font-semibold text-blue-900">FilmSage</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                &copy; 2025 FilmSage. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Desktop Navigation Button
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'text-blue-900 bg-blue-50'
          : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
      } transition-colors duration-150 ease-in-out`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

// Mobile Navigation Button
function MobileNavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
        isActive
          ? 'text-blue-900 bg-blue-50'
          : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
      } transition-colors duration-150 ease-in-out`}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        {label}
      </div>
    </button>
  );
}

export default App;