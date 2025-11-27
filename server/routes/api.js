const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const deckController = require('../controllers/deckController');

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/decks', deckController.getAllDecks);
router.get('/decks/:id', deckController.getDeckById);
router.post('/decks', deckController.createDeck);
router.put('/decks/:id', deckController.updateDeck);
router.delete('/decks/:id', deckController.deleteDeck);

module.exports = router;
