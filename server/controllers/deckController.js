const { Deck, Card } = require('../models/database');
const { awardFirstDeck } = require('./achievementController');

exports.getAllDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ user_id: req.userId || 1 });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, user_id: req.userId || 1 });
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    const cards = await Card.find({ deck_id: req.params.id });
    const deckObj = deck.toObject();
    deckObj.id = deckObj._id.toString();
    const cardsObj = cards.map(c => {
      const o = c.toObject();
      o.id = o._id.toString();
      return o;
    });
    res.json({ ...deckObj, cards: cardsObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDeck = async (req, res) => {
  const { title, description } = req.body;
  try {
    const deck = new Deck({ title, description, user_id: req.userId || 1 });
    await deck.save();
    // award achievement for first deck
    await awardFirstDeck(req.userId || 1);
    const deckObj = deck.toObject();
    deckObj.id = deckObj._id.toString();
    res.status(201).json({ ...deckObj, cards: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeck = async (req, res) => {
  const { title, description } = req.body;
  try {
    const deck = await Deck.findOneAndUpdate({ _id: req.params.id, user_id: req.userId || 1 }, { title, description }, { new: true });
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    const deckObj = deck.toObject();
    deckObj.id = deckObj._id.toString();
    res.json(deckObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({ _id: req.params.id, user_id: req.userId || 1 });
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    // cascade delete cards
    await Card.deleteMany({ deck_id: req.params.id });
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
