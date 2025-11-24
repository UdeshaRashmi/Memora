import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  };

  return (
    <nav className="gradient-primary shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-purple-200 transition-colors duration-300 hover-scale">
              ✨ Memora
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {currentUser ? (
              <>
                <Link to="/" className="text-white hover:text-purple-200 transition-all duration-300 hover:scale-110 font-medium">Home</Link>
                <Link to="/decks" className="text-white hover:text-purple-200 transition-all duration-300 hover:scale-110 font-medium">Decks</Link>
                <Link to="/study" className="text-white hover:text-purple-200 transition-all duration-300 hover:scale-110 font-medium">Study</Link>
                <Link to="/leaderboard" className="text-white hover:text-purple-200 transition-all duration-300 hover:scale-110 font-medium">Leaderboard</Link>
                
                <button 
                  onClick={toggleDarkMode}
                  className="text-white hover:text-yellow-300 transition-all duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover-lift font-medium"
                >
                  Logout
                </button>
                <span className="text-white text-sm font-medium">👤 {currentUser.email}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-purple-200 transition-all duration-300 hover:scale-110 font-medium">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-100 transition-all duration-300 hover-lift font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;