const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deckController');
const cardController = require('../controllers/cardController');
const achievementController = require('../controllers/achievementController');

router.get('/decks', deckController.getAllDecks);
router.get('/decks/:id', deckController.getDeckById);
router.post('/decks', deckController.createDeck);
router.put('/decks/:id', deckController.updateDeck);
router.delete('/decks/:id', deckController.deleteDeck);

router.get('/decks/:deckId/cards', cardController.getCardsByDeck);
router.post('/decks/:deckId/cards', cardController.createCard);
router.put('/decks/:deckId/cards/:cardId', cardController.updateCard);
router.delete('/decks/:deckId/cards/:cardId', cardController.deleteCard);

router.post('/study-session', achievementController.addStudySession);
router.get('/achievements', achievementController.getUserAchievements);
router.get('/user-stats', achievementController.getUserStats);
router.get('/leaderboard', achievementController.getLeaderboard);

module.exports = router;
