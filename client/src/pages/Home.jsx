import React, { useEffect, useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { API_BASE } from '../config';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const { userStats, loadUserStats } = useProgress();
  const [recentAchievements, setRecentAchievements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserStats();
    fetchRecentAchievements();
  }, []);

  const fetchRecentAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE}/achievements`);
      if (response.ok) {
        const data = await response.json();
        // normalize _id -> id
        const normalized = data.map(a => ({ ...a, id: a.id || a._id }));
        setRecentAchievements(normalized.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const statCards = [
    { label: 'Decks Created', value: userStats.totalDecks, icon: '📚', color: 'from-blue-400 to-blue-600' },
    { label: 'Cards Studied', value: userStats.totalCards, icon: '📇', color: 'from-purple-400 to-purple-600' },
    { label: 'Minutes Studied', value: userStats.totalStudyTime, icon: '⏱️', color: 'from-green-400 to-green-600' },
    { label: 'Achievement Points', value: userStats.totalPoints, icon: '⭐', color: 'from-yellow-400 to-orange-600' },
  ];

  return (
    <div className="home-page min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      
      <header className="home-header gradient-primary dark:from-purple-900 dark:to-indigo-900 text-white py-24 text-center shadow-2xl dark:shadow-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -ml-40 -mb-40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">✨ Welcome to Memora</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-purple-100 dark:text-purple-200">Your personal memory assistant for effective learning</p>
          <button 
            onClick={() => navigate('/decks')}
            className="mt-8 btn-gradient text-white font-bold py-3 px-8 rounded-lg shadow-lg inline-block"
          >
            🚀 Get Started
          </button>
        </div>
      </header>
      
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center animate-slideInLeft">📊 Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((stat, index) => (
            <div 
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl p-8 text-center text-white hover-lift animate-fadeInUp transition-all`}
            >
              <div className="text-5xl mb-3">{stat.icon}</div>
              <h3 className="text-5xl font-bold mb-2">{stat.value}</h3>
              <p className="text-white text-opacity-90 font-medium">{stat.label}</p>
              <div className="mt-4 h-1 bg-white bg-opacity-30 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="home-features py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center animate-slideInRight">✨ Why Choose Memora?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature bg-gradient-to-br from-blue-50 dark:from-blue-900 dark:from-opacity-30 to-blue-100 dark:to-blue-800 dark:to-opacity-30 p-8 rounded-2xl shadow-lg dark:shadow-gray-900 hover-lift border-2 border-blue-200 dark:border-blue-700 transition-all">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Create Decks</h2>
            <p className="text-gray-600 dark:text-gray-400">Build custom flashcard decks for any subject with an intuitive interface</p>
          </div>
          
          <div className="feature bg-gradient-to-br from-purple-50 dark:from-purple-900 dark:from-opacity-30 to-purple-100 dark:to-purple-800 dark:to-opacity-30 p-8 rounded-2xl shadow-lg dark:shadow-gray-900 hover-lift border-2 border-purple-200 dark:border-purple-700 transition-all">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Study Efficiently</h2>
            <p className="text-gray-600 dark:text-gray-400">Use spaced repetition and interactive study mode to optimize your learning</p>
          </div>
          
          <div className="feature bg-gradient-to-br from-pink-50 dark:from-pink-900 dark:from-opacity-30 to-pink-100 dark:to-pink-800 dark:to-opacity-30 p-8 rounded-2xl shadow-lg dark:shadow-gray-900 hover-lift border-2 border-pink-200 dark:border-pink-700 transition-all">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Track Progress</h2>
            <p className="text-gray-600 dark:text-gray-400">Monitor your improvement over time with detailed statistics and insights</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center animate-slideInLeft">🏆 Recent Achievements</h2>
        {recentAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAchievements.map(achievement => (
              <div 
                key={achievement.id}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 rounded-2xl shadow-xl dark:shadow-gray-900 p-8 text-white hover-lift transition-all"
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-purple-100 dark:text-purple-200 mb-4">{achievement.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-lg text-sm font-semibold">+{achievement.points} pts</span>
                  <span className="text-xs text-purple-200">
                    {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">🎯 No achievements yet. Start studying to unlock achievements!</p>
            <button
              onClick={() => navigate('/decks')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
            >
              📚 Start Studying
            </button>
          </div>
        )}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-indigo-600 dark:text-indigo-400 font-bold text-lg hover:text-purple-700 dark:hover:text-purple-300 transition-colors inline-flex items-center gap-2"
          >
            View All Achievements & Leaderboard →
          </button>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 text-white rounded-3xl max-w-4xl mx-auto mb-12 text-center shadow-2xl dark:shadow-gray-900">
        <h2 className="text-3xl font-bold mb-4">🎯 Ready to Start Learning?</h2>
        <p className="text-lg text-purple-100 dark:text-purple-200 mb-8">Create your first flashcard deck and begin your learning journey today!</p>
        <button 
          onClick={() => navigate('/decks')}
          className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold py-3 px-8 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition-all duration-300 hover-lift inline-block"
        >
          📚 Browse Decks
        </button>
      </section>
    </div>
  );
};

export default Home;