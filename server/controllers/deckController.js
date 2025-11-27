const { Deck, User } = require('../models/database');

exports.getAllDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ user_id: req.userId });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, user_id: req.userId });
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    const deckObj = deck.toObject();
    deckObj.id = deckObj._id.toString();
    res.json(deckObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDeck = async (req, res) => {
  const { title, description } = req.body;
  try {
    const deck = new Deck({ title, description, user_id: req.userId });
    await deck.save();
    const deckObj = deck.toObject();
    deckObj.id = deckObj._id.toString();
    res.status(201).json(deckObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeck = async (req, res) => {
  const { title, description } = req.body;
  try {
    const deck = await Deck.findOneAndUpdate({ _id: req.params.id, user_id: req.userId }, { title, description }, { new: true });
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
    const deck = await Deck.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
