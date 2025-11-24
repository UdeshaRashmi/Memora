const { Achievement, StudySession, Deck, Card } = require('../models/database');

const ACHIEVEMENT_TYPES = {
  FIRST_DECK: { type: 'first_deck', title: '🎯 First Steps', description: 'Create your first deck', icon: '🎯', points: 10 },
  FIRST_SESSION: { type: 'first_session', title: '🚀 Getting Started', description: 'Complete your first study session', icon: '🚀', points: 20 },
  TEN_SESSIONS: { type: 'ten_sessions', title: '👨‍🎓 Dedicated Learner', description: 'Complete 10 study sessions', icon: '👨‍🎓', points: 30 },
  HUNDRED_CARDS: { type: 'hundred_cards', title: '💯 Century Club', description: 'Study 100 cards', icon: '💯', points: 40 },
  HOUR_STUDY: { type: 'hour_study', title: '⏰ Time Keeper', description: 'Study for 60 minutes total', icon: '⏰', points: 35 },
  PERFECT_SESSION: { type: 'perfect_session', title: '🏆 Perfect Score', description: 'Complete a session with 100% accuracy', icon: '🏆', points: 45 }
};

exports.addStudySession = async (req, res) => {
  const { deck_id, cards_studied, total_cards, duration, completed } = req.body;
  const userId = req.userId || 1;

  try {
    const session = new StudySession({ user_id: userId, deck_id, cards_studied, total_cards, duration, completed: completed || false });
    await session.save();

    await checkAndAwardAchievements(userId, {
      sessionId: session._id,
      cardsStudied: cards_studied,
      totalCards: total_cards,
      duration,
      completed
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserAchievements = async (req, res) => {
  const userId = req.userId || 1;
  try {
    const achievements = await Achievement.find({ user_id: userId }).sort({ unlocked_at: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  const userId = req.userId || 1;
  try {
    const sessionsAgg = await StudySession.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, total_minutes: { $sum: '$duration' }, total_sessions: { $sum: 1 }, total_cards_studied: { $sum: '$cards_studied' } } }
    ]);

    const deckCount = await Deck.countDocuments({ user_id: userId });
    const achievementsAgg = await Achievement.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, count: { $sum: 1 }, total_points: { $sum: '$points' } } }
    ]);

    const s = sessionsAgg[0] || { total_minutes: 0, total_sessions: 0, total_cards_studied: 0 };
    const a = achievementsAgg[0] || { count: 0, total_points: 0 };

    const stats = {
      total_study_time: s.total_minutes || 0,
      total_sessions: s.total_sessions || 0,
      total_cards_studied: s.total_cards_studied || 0,
      total_decks: deckCount || 0,
      achievements_unlocked: a.count || 0,
      total_points: a.total_points || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Basic leaderboard aggregated by points
    const leaderboard = await Achievement.aggregate([
      { $group: { _id: '$user_id', points: { $sum: '$points' }, achievements_count: { $sum: 1 } } },
      { $sort: { points: -1, achievements_count: -1 } },
      { $limit: 50 }
    ]);

    const ranked = leaderboard.map((entry, index) => ({ user_id: entry._id, points: entry.points, achievements_count: entry.achievements_count, rank: index + 1 }));
    res.json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function checkAndAwardAchievements(userId, sessionData) {
  try {
    const existingAchievements = await Achievement.find({ user_id: userId });
    const unlockedTypes = existingAchievements.map(a => a.achievement_type);

    const achievementsToAward = [];

    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.FIRST_SESSION.type) && sessionData.sessionId) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.FIRST_SESSION);
    }

    const sessionsCount = await StudySession.countDocuments({ user_id: userId });
    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.TEN_SESSIONS.type) && sessionsCount >= 10) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.TEN_SESSIONS);
    }

    const cardsStudiedAgg = await StudySession.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, total: { $sum: '$cards_studied' } } }
    ]);
    const totalCards = (cardsStudiedAgg[0] && cardsStudiedAgg[0].total) || 0;
    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.HUNDRED_CARDS.type) && totalCards >= 100) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.HUNDRED_CARDS);
    }

    const studyTimeAgg = await StudySession.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);
    const studyTime = (studyTimeAgg[0] && studyTimeAgg[0].total) || 0;
    if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.HOUR_STUDY.type) && studyTime >= 60) {
      achievementsToAward.push(ACHIEVEMENT_TYPES.HOUR_STUDY);
    }

    if (sessionData.completed && sessionData.cardsStudied === sessionData.totalCards) {
      if (!unlockedTypes.includes(ACHIEVEMENT_TYPES.PERFECT_SESSION.type)) {
        achievementsToAward.push(ACHIEVEMENT_TYPES.PERFECT_SESSION);
      }
    }

    for (const achievement of achievementsToAward) {
      const a = new Achievement({ user_id: userId, achievement_type: achievement.type, title: achievement.title, description: achievement.description, icon: achievement.icon, points: achievement.points });
      await a.save();
    }
  } catch (error) {
    console.error('Error checking and awarding achievements:', error);
  }
}

exports.awardFirstDeck = async (userId) => {
  try {
    const existing = await Achievement.findOne({ user_id: userId, achievement_type: ACHIEVEMENT_TYPES.FIRST_DECK.type });
    if (!existing) {
      const a = new Achievement({ user_id, achievement_type: ACHIEVEMENT_TYPES.FIRST_DECK.type, title: ACHIEVEMENT_TYPES.FIRST_DECK.title, description: ACHIEVEMENT_TYPES.FIRST_DECK.description, icon: ACHIEVEMENT_TYPES.FIRST_DECK.icon, points: ACHIEVEMENT_TYPES.FIRST_DECK.points });
      await a.save();
    }
  } catch (error) {
    console.error('Error awarding first deck achievement:', error);
  }
};
