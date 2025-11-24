import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch {
      setError('Failed to log in');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Memora</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your memory assistant awaits</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900 py-8 px-4 sm:px-10 backdrop-blur-sm border border-purple-100 dark:border-purple-900">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 dark:bg-opacity-30 border-2 border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center" role="alert">
              <span className="text-xl mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                📧 Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                🔐 Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white font-bold py-3 rounded-lg shadow-lg hover-lift disabled:opacity-50 transition-all"
            >
              {loading ? '⏳ Signing in...' : '✨ Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
              Don't have an account?
            </p>
            <Link to="/signup" className="w-full flex justify-center py-3 px-4 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg font-bold hover:bg-purple-50 dark:hover:bg-purple-900 dark:hover:bg-opacity-30 transition-all duration-300">
              📝 Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;