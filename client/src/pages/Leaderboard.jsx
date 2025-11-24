import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { API_BASE } from '../config';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
  const { studySessions } = useProgress();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
    fetchUserAchievements();
    fetchUserStats();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        // backend returns entries like { user_id, points, achievements_count, rank }
        const normalized = data.map((entry, idx) => ({
          user_id: entry.user_id || entry._id || entry.id,
          name: entry.name || `User ${entry.user_id || entry._id || idx + 1}`,
          points: entry.points || 0,
          achievements_count: entry.achievements_count || 0,
          total_study_time: entry.total_study_time || 0,
          rank: entry.rank || idx + 1
        }));
        setLeaderboardData(normalized);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE}/achievements`);
      if (response.ok) {
        const data = await response.json();
        const normalized = data.map(a => ({ ...a, id: a.id || a._id }));
        setUserAchievements(normalized);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/user-stats`);
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getMedalEmoji = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '⭐';
    }
  };

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-400 text-yellow-900';
      case 2: return 'bg-gray-300 text-gray-700';
      case 3: return 'bg-orange-400 text-orange-900';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="leaderboard min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      
      <header className="py-12 px-4 text-center text-white dark:text-gray-100">
        <h1 className="text-5xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-purple-200 dark:text-purple-300 text-lg">Compete and celebrate achievements</p>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 p-8 transform hover:scale-105 transition">
            <div className="text-purple-600 dark:text-purple-400 text-4xl font-bold">{userStats?.total_study_time || 0}</div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">⏱️ Minutes Studied</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 p-8 transform hover:scale-105 transition">
            <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold">{userStats?.total_sessions || 0}</div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">📚 Study Sessions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 p-8 transform hover:scale-105 transition">
            <div className="text-orange-600 dark:text-orange-400 text-4xl font-bold">{userStats?.total_points || 0}</div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">⭐ Achievement Points</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'global'
                  ? 'bg-purple-600 text-white shadow-lg dark:bg-purple-700'
                  : 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-gray-700'
              }`}
            >
              Global Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'achievements'
                  ? 'bg-purple-600 text-white shadow-lg dark:bg-purple-700'
                  : 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-gray-700'
              }`}
            >
              Your Achievements
            </button>
          </div>

          {activeTab === 'global' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading leaderboard...</div>
              ) : leaderboardData.length > 0 ? (
                <div className="overflow-x-auto">
                  {leaderboardData.map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-6 border-b dark:border-gray-700 last:border-b-0 transition hover:bg-purple-50 dark:hover:bg-gray-700 ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 dark:from-yellow-900 dark:from-opacity-20 to-transparent' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getMedalColor(user.rank)} border-2 dark:border-gray-600 border-gray-200`}>
                          {getMedalEmoji(user.rank)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{user.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.achievements_count} achievements</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.points} pts</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(user.total_study_time)} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">No leaderboard data yet</div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {userAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 rounded-xl p-6 text-white shadow-lg dark:shadow-gray-900 transform hover:scale-105 transition"
                    >
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-bold text-lg">{achievement.title}</h3>
                      <p className="text-purple-100 dark:text-purple-200 text-sm mt-2">{achievement.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm font-semibold">+{achievement.points} pts</span>
                        <span className="text-xs text-purple-200">
                          {new Date(achievement.unlocked_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">🎯 No achievements yet. Start studying to unlock achievements!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            📊 Recent Study Sessions
          </h2>
          {studySessions.length > 0 ? (
            <div className="space-y-4">
              {studySessions.slice().reverse().slice(0, 10).map((session, index) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 transition border-l-4 border-purple-500">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{index + 1}. {session.deckTitle}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {session.cardsStudied} of {session.totalCards} cards • {session.duration} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {Math.round((session.cardsStudied / session.totalCards) * 100)}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">🚀 No study sessions yet. Start studying to see your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;