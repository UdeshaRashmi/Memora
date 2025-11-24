import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeck } from '../context/DeckContext';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';

const DeckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDeckById, addCard, updateCard, deleteCard } = useDeck();
  
  const [deck, setDeck] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({ front: '', back: '', difficulty: 'medium' });
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = async () => {
    const deckData = await getDeckById(id);
    setDeck(deckData);
  };

  const getFilteredCards = () => {
    if (!deck?.cards) return [];
    return deck.cards.filter(card => {
      const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.back.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || (card.difficulty || 'medium') === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Deck not found</h2>
            <button
              onClick={() => navigate('/decks')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStudy = () => {
    navigate(`/study/${id}`);
  };

  const handleAddCard = async () => {
    if (!formData.front.trim() || !formData.back.trim()) return;
    
    if (editingCard) {
      await updateCard(id, editingCard.id, formData);
    } else {
      await addCard(id, formData);
    }
    
    await loadDeck();
    setFormData({ front: '', back: '' });
    setEditingCard(null);
    setShowAddCard(false);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setFormData({ front: card.front, back: card.back, difficulty: card.difficulty || 'medium' });
    setShowAddCard(true);
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Delete this card?')) {
      await deleteCard(id, cardId);
      await loadDeck();
    }
  };

  const handleCloseModal = () => {
    setShowAddCard(false);
    setEditingCard(null);
    setFormData({ front: '', back: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="gradient-primary dark:from-purple-900 dark:to-indigo-900 shadow-2xl dark:shadow-gray-900 rounded-2xl p-8 mb-8 text-white animate-fadeInUp">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">✨ {deck.title}</h1>
              <p className="text-purple-100 dark:text-purple-200 mb-4 text-lg">{deck.description || 'No description'}</p>
              <div className="flex gap-6">
                <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <p className="text-white text-sm font-medium">📚 {deck.cards?.length || 0} Cards</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleStudy}
              className="btn-gradient text-white font-bold py-3 px-8 rounded-lg shadow-lg whitespace-nowrap"
            >
              🎓 Study Deck
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-2xl dark:shadow-gray-900 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">📇 Flashcards</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Click on a card to flip</p>
            </div>
            <button
              onClick={() => setShowAddCard(true)}
              className="btn-gradient-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            >
              ➕ Add Card
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDifficultyFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  difficultyFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All ({deck.cards?.length || 0})
              </button>
              <button
                onClick={() => setDifficultyFilter('easy')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  difficultyFilter === 'easy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Easy ({deck.cards?.filter(c => !c.difficulty || c.difficulty === 'easy').length || 0})
              </button>
              <button
                onClick={() => setDifficultyFilter('medium')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  difficultyFilter === 'medium'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Medium ({deck.cards?.filter(c => c.difficulty === 'medium').length || 0})
              </button>
              <button
                onClick={() => setDifficultyFilter('hard')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  difficultyFilter === 'hard'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Hard ({deck.cards?.filter(c => c.difficulty === 'hard').length || 0})
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredCards().map((card, index) => (
              <div key={card.id} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                <Flashcard card={card} />
                <div className={`absolute top-4 left-4 px-2 py-1 rounded text-white text-xs font-bold ${getDifficultyColor(card.difficulty || 'medium')}`}>
                  {card.difficulty ? card.difficulty.toUpperCase() : 'MEDIUM'}
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-fadeInUp">
                  <button
                    onClick={() => handleEditCard(card)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg transition-all duration-200 hover-lift"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg transition-all duration-200 hover-lift"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {getFilteredCards().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {deck.cards?.length === 0 ? 'No cards yet. Add one to get started!' : 'No cards match your filters.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {editingCard ? 'Edit Card' : 'Add New Card'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Front
                </label>
                <textarea
                  value={formData.front}
                  onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Back
                </label>
                <textarea
                  value={formData.back}
                  onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleAddCard}
                className="flex-1 bg-indigo-600 dark:bg-indigo-700 text-white py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                {editingCard ? 'Update' : 'Add'}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckDetail;