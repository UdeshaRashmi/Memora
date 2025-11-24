const { pool } = require('../models/database');
const { awardFirstDeck } = require('./achievementController');

exports.getAllDecks = async (req, res) => {
  try {
    const [decks] = await pool.query('SELECT * FROM decks WHERE user_id = ?', [req.userId || 1]);
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeckById = async (req, res) => {
  try {
    const [decks] = await pool.query('SELECT * FROM decks WHERE id = ? AND user_id = ?', [req.params.id, req.userId || 1]);
    if (!decks.length) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    const [cards] = await pool.query('SELECT * FROM cards WHERE deck_id = ?', [req.params.id]);
    res.json({ ...decks[0], cards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDeck = async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO decks (title, description, user_id) VALUES (?, ?, ?)', [title, description, req.userId || 1]);
    res.status(201).json({ id: result.insertId, title, description, cards: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeck = async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await pool.query('UPDATE decks SET title = ?, description = ? WHERE id = ? AND user_id = ?', [title, description, req.params.id, req.userId || 1]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    res.json({ id: req.params.id, title, description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDeck = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM decks WHERE id = ? AND user_id = ?', [req.params.id, req.userId || 1]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
