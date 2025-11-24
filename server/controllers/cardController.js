const { Card, Deck } = require('../models/database');

exports.getCardsByDeck = async (req, res) => {
  try {
    const cards = await Card.find({ deck_id: req.params.deckId });
    const cardsObj = cards.map(c => {
      const o = c.toObject();
      o.id = o._id.toString();
      return o;
    });
    res.json(cardsObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCard = async (req, res) => {
  const { front, back, difficulty } = req.body;
  try {
    // Ensure deck exists
    const deck = await Deck.findById(req.params.deckId);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });

    const card = new Card({ deck_id: req.params.deckId, front, back, difficulty: difficulty || 'medium' });
    await card.save();
    const cardObj = card.toObject();
    cardObj.id = cardObj._id.toString();
    res.status(201).json(cardObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCard = async (req, res) => {
  const { front, back, difficulty } = req.body;
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId, { front, back, difficulty: difficulty || 'medium' }, { new: true });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const cardObj = card.toObject();
    cardObj.id = cardObj._id.toString();
    res.json(cardObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
