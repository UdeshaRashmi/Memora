const { pool } = require('../models/database');

exports.getCardsByDeck = async (req, res) => {
  try {
    const [cards] = await pool.query('SELECT * FROM cards WHERE deck_id = ?', [req.params.deckId]);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCard = async (req, res) => {
  const { front, back } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)', [req.params.deckId, front, back]);
    res.status(201).json({ id: result.insertId, deck_id: req.params.deckId, front, back });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCard = async (req, res) => {
  const { front, back } = req.body;
  try {
    const [result] = await pool.query('UPDATE cards SET front = ?, back = ? WHERE id = ?', [front, back, req.params.cardId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ id: req.params.cardId, deck_id: req.params.deckId, front, back });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM cards WHERE id = ?', [req.params.cardId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
