import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeck } from '../context/DeckContext';
import Navbar from '../components/Navbar';

const CreateDeck = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([{ front: '', back: '' }]);
  const navigate = useNavigate();
  const { addDeck } = useDeck();

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const updateCard = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      const updatedCards = cards.filter((_, i) => i !== index);
      setCards(updatedCards);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDeck({ title, description, cards });
    navigate('/decks');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 dark:from-orange-500 dark:to-red-500 bg-clip-text text-transparent mb-2">✨ Create New Deck</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Build your custom flashcard collection</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900 p-8 backdrop-blur-sm border border-orange-100 dark:border-orange-900">
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              📚 Deck Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="e.g., Spanish Vocabulary"
              required
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              📝 Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              rows="3"
              placeholder="Describe what this deck is about..."
            />
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">📇 Flashcards</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                type="button"
                onClick={addCard}
                className="btn-gradient-secondary text-white font-bold py-2 px-6 rounded-lg shadow-lg"
              >
                ➕ Add Card
              </button>
            </div>
            
            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 dark:from-orange-900 dark:from-opacity-20 to-yellow-50 dark:to-yellow-900 dark:to-opacity-20 border-2 border-orange-200 dark:border-orange-700 p-6 rounded-lg hover-lift transition-all">
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-to-r from-orange-400 to-red-600 dark:from-orange-500 dark:to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Card {index + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        ❓ Question (Front)
                      </label>
                      <textarea
                        value={card.front}
                        onChange={(e) => updateCard(index, 'front', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows="2"
                        placeholder="What should be on the front?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        ✅ Answer (Back)
                      </label>
                      <textarea
                        value={card.back}
                        onChange={(e) => updateCard(index, 'back', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows="2"
                        placeholder="What should be on the back?"
                        required
                      />
                    </div>
                  </div>
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold text-sm transition-colors"
                    >
                      🗑️ Remove Card
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t border-orange-200 dark:border-orange-700">
            <button
              type="button"
              onClick={() => navigate('/decks')}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
            >
              ✕ Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 btn-gradient text-white font-bold rounded-lg shadow-lg hover-lift transition-all"
            >
              ✨ Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeck;