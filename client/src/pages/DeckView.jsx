import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeck } from '../context/DeckContext';
import Navbar from '../components/Navbar';
import DeckCard from '../components/DeckCard';
import SearchBar from '../components/SearchBar';

const DeckView = () => {
  const navigate = useNavigate();
  const { decks, updateDeck } = useDeck();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [editingDeck, setEditingDeck] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [refreshKey, setRefreshKey] = useState(0);
  
  const filteredDecks = decks.filter(deck => 
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    switch(sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'cards':
        return (b.cards?.length || 0) - (a.cards?.length || 0);
      case 'recent':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  const handleCreateDeck = () => {
    navigate('/create-deck');
  };

  const handleEditDeck = (deck) => {
    setEditingDeck(deck);
    setFormData({ title: deck.title, description: deck.description });
  };

  const handleSaveEdit = async () => {
    if (!formData.title.trim()) return;
    await updateDeck(editingDeck.id, formData);
    setEditingDeck(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseModal = () => {
    setEditingDeck(null);
    setFormData({ title: '', description: '' });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="deck-view min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <header className="deck-header gradient-primary dark:from-purple-900 dark:to-indigo-900 shadow-2xl dark:shadow-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="animate-slideInLeft">
              <h1 className="text-4xl font-bold text-white mb-2">📚 Your Decks</h1>
              <p className="text-purple-100 dark:text-purple-200">{decks.length} deck{decks.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-slideInRight">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <button 
                onClick={handleCreateDeck}
                className="btn-gradient text-white font-bold py-3 px-6 rounded-lg whitespace-nowrap shadow-lg"
              >
                ✨ Create New Deck
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="text-purple-100 text-sm">Sort by:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('title')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  sortBy === 'title' 
                    ? 'bg-white text-purple-600' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => setSortBy('cards')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  sortBy === 'cards' 
                    ? 'bg-white text-purple-600' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                📚 Cards
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  sortBy === 'recent' 
                    ? 'bg-white text-purple-600' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                📅 Recent
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="deck-list py-12 px-4 max-w-7xl mx-auto" key={refreshKey}>
        {sortedDecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeInUp">
            {sortedDecks.map((deck, index) => (
              <div key={deck.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fadeInUp">
                <DeckCard 
                  deck={deck}
                  onDelete={handleRefresh}
                  onEdit={handleEditDeck}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center backdrop-blur-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No decks found</h2>
            <p className="text-gray-600 mb-6 text-lg">
              {searchTerm ? 'Try a different search term' : 'Create your first deck to get started'}
            </p>
            <button
              onClick={handleCreateDeck}
              className="btn-gradient text-white font-bold py-3 px-8 rounded-lg shadow-lg inline-block"
            >
              ✨ Create Your First Deck
            </button>
          </div>
        )}
      </div>

      {editingDeck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Deck</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  rows="3"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
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

export default DeckView;