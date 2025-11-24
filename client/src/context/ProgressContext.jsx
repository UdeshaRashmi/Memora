import React, { createContext, useContext, useState, useCallback } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  return useContext(ProgressContext);
};

export const ProgressProvider = ({ children }) => {
  const [studySessions, setStudySessions] = useState([]);
  const [userStats, setUserStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    totalStudyTime: 0,
    streak: 0,
    achievements: 0,
    totalPoints: 0
  });

  const addStudySession = useCallback(async (session) => {
    try {
      const response = await fetch('http://localhost:5000/api/study-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deck_id: session.deckId,
          cards_studied: session.cardsStudied,
          total_cards: session.totalCards,
          duration: session.duration,
          completed: session.completed
        })
      });

      if (response.ok) {
        const newSession = {
          ...session,
          id: Date.now(),
          date: new Date().toISOString()
        };
        setStudySessions(prev => [...prev, newSession]);

        setUserStats(prevStats => ({
          ...prevStats,
          totalStudyTime: prevStats.totalStudyTime + (session.duration || 0),
          streak: session.completed ? prevStats.streak + 1 : prevStats.streak
        }));
      }
    } catch (error) {
      console.error('Error adding study session:', error);
    }
  }, []);

  const loadUserStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-stats');
      if (response.ok) {
        const stats = await response.json();
        setUserStats(prev => ({
          ...prev,
          totalStudyTime: stats.total_study_time || 0,
          achievements: stats.achievements_unlocked || 0,
          totalPoints: stats.total_points || 0,
          totalDecks: stats.total_decks || 0,
          totalCards: stats.total_cards_studied || 0
        }));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, []);

  const value = {
    studySessions,
    userStats,
    addStudySession,
    loadUserStats
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};