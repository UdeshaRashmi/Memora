const { pool } = require('../models/database');

const ACHIEVEMENT_TYPES = {
  FIRST_DECK: { type: 'first_deck', title: '🎯 First Steps', description: 'Create your first deck', icon: '🎯', points: 10 },
  FIVE_CARDS: { type: 'five_cards', title: '📚 Growing Library', description: 'Add 5 cards to a deck', icon: '📚', points: 15 },
  STUDY_STREAK_3: { type: 'study_streak_3', title: '🔥 On Fire', description: 'Study for 3 consecutive days', icon: '🔥', points: 25 },
  STUDY_STREAK_7: { type: 'study_streak_7', title: '⚡ Unstoppable', description: 'Study for 7 consecutive days', icon: '⚡', points: 50 },
  HUNDRED_CARDS: { type: 'hundred_cards', title: '💯 Century Club', description: 'Study 100 cards', icon: '💯', points: 40 },
  FIRST_SESSION: { type: 'first_session', title: '🚀 Getting Started', description: 'Complete your first study session', icon: '🚀', points: 20 },
  TEN_SESSIONS: { type: 'ten_sessions', title: '👨‍🎓 Dedicated Learner', description: 'Complete 10 study sessions', icon: '👨‍🎓', points: 30 },
  HOUR_STUDY: { type: 'hour_study', title: '⏰ Time Keeper', description: 'Study for 60 minutes total', icon: '⏰', points: 35 },
  PERFECT_SESSION: { type: 'perfect_session', title: '🏆 Perfect Score', description: 'Complete a session with 100% accuracy', icon: '🏆', points: 45 }
};

exports.addStudySession = async (req, res) => {
  const { deck_id, cards_studied, total_cards, duration, completed } = req.body;
  const userId = req.userId;

  try {
    const [result] = await pool.query(
      'INSERT INTO study_sessions (user_id, deck_id, cards_studied, total_cards, duration, completed) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, deck_id, cards_studied, total_cards, duration, completed || false]
    );

    const sessionId = result.insertId;
    
    await checkAndAwardAchievements(userId, {
      sessionId,
      cardsStudied: cards_studied,
      totalCards: total_cards,
      duration,
      completed
    });

    res.status(201).json({ id: sessionId, user_id: userId, deck_id, cards_studied, total_cards, duration, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserAchievements = async (req, res) => {
  const userId = req.userId;

  try {
    const [achievements] = await pool.query(
      'SELECT * FROM achievements WHERE user_id = ? ORDER BY unlocked_at DESC',
      [userId]
    );
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  const userId = req.userId;

  try {
    const [sessions] = await pool.query(
      'SELECT SUM(duration) as total_minutes, COUNT(*) as total_sessions, SUM(cards_studied) as total_cards_studied FROM study_sessions WHERE user_id = ?',
      [userId]
    );

    const [deckCount] = await pool.query(
      'SELECT COUNT(*) as count FROM decks WHERE user_id = ?',
      [userId]
    );

    const [achievements] = await pool.query(
      'SELECT COUNT(*) as count, SUM(points) as total_points FROM achievements WHERE user_id = ?',
      [userId]
    );

    const stats = {
      total_study_time: sessions[0].total_minutes || 0,
      total_sessions: sessions[0].total_sessions || 0,
      total_cards_studied: sessions[0].total_cards_studied || 0,
      total_decks: deckCount[0].count || 0,
      achievements_unlocked: achievements[0].count || 0,
      total_points: achievements[0].total_points || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const [leaderboard] = await pool.query(`
      SELECT 
        u.id,
        COALESCE(u.email, CONCAT('User ', u.id)) as name,
        COALESCE(SUM(a.points), 0) as points,
        COUNT(DISTINCT a.id) as achievements_count,
        COALESCE(SUM(ss.duration), 0) as total_study_time
      FROM (SELECT DISTINCT user_id as id FROM decks UNION SELECT DISTINCT user_id as id FROM study_sessions UNION SELECT DISTINCT user_id FROM achievements) u
      LEFT JOIN achievements a ON u.id = a.user_id
      LEFT JOIN study_sessions ss ON u.id = ss.user_id
      GROUP BY u.id
      ORDER BY points DESC, achievements_count DESC
      LIMIT 50
    `);

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function checkAndAwardAchievements(userId, sessionData) {
  try {
    const [existingAchievements] = await pool.query(
      'SELECT achievement_type FROM achievements WHERE user_id = ?',
      [userId]
    );
    const unlockedTypes = existingAchievements.map(a => a.achievement_type);

    const achievementsToAward = [];

    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.FIRST_SESSION.type) && sessionData.sessionId) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.FIRST_SESSION);
    }

    const [sessions] = await pool.query(
      'SELECT COUNT(*) as count FROM study_sessions WHERE user_id = ?',
      [userId]
    );
    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.TEN_SESSIONS.type) && sessions[0].count >= 10) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.TEN_SESSIONS);
    }

    const [cardsStudied] = await pool.query(
      'SELECT SUM(cards_studied) as total FROM study_sessions WHERE user_id = ?',
      [userId]
    );
    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.HUNDRED_CARDS.type) && cardsStudied[0].total >= 100) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.HUNDRED_CARDS);
    }

    const [studyTime] = await pool.query(
      'SELECT SUM(duration) as total FROM study_sessions WHERE user_id = ?',
      [userId]
    );
    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.HOUR_STUDY.type) && studyTime[0].total >= 60) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.HOUR_STUDY);
    }

    if (sessionData.completed && sessionData.cardsStudied === sessionData.totalCards) {
      if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.PERFECT_SESSION.type)) {
        achievementsToAward.push(ACHIEVEMENT_TYPES.PERFECT_SESSION);
      }
    }

    for (const achievement of achievementsToAward) {
      await pool.query(
        'INSERT INTO achievements (user_id, achievement_type, title, description, icon, points) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, achievement.type, achievement.title, achievement.description, achievement.icon, achievement.points]
      );
    }
  } catch (error) {
    console.error('Error checking and awarding achievements:', error);
  }
}

exports.awardFirstDeck = async (userId) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM achievements WHERE user_id = ? AND achievement_type = ?',
      [userId, ACHIEVEMENT_TYPES.FIRST_DECK.type]
    );

    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO achievements (user_id, achievement_type, title, description, icon, points) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, ACHIEVEMENT_TYPES.FIRST_DECK.type, ACHIEVEMENT_TYPES.FIRST_DECK.title, ACHIEVEMENT_TYPES.FIRST_DECK.description, ACHIEVEMENT_TYPES.FIRST_DECK.icon, ACHIEVEMENT_TYPES.FIRST_DECK.points]
      );
    }
  } catch (error) {
    console.error('Error awarding first deck achievement:', error);
  }
};
