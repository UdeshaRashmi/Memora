import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeck } from '../context/DeckContext';

const DeckCard = ({ deck, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const { deleteDeck } = useDeck();
  const [showActions, setShowActions] = useState(false);
  
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-orange-500',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-cyan-400 to-cyan-600'
  ];
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  const handleClick = (e) => {
    if (showActions) return;
    navigate(`/deck/${deck.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${deck.title}" deck?`)) {
      await deleteDeck(deck.id);
      onDelete?.();
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(deck);
  };

  return (
    <div 
      className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 m-4 hover:shadow-2xl transition-all duration-300 cursor-pointer relative group hover-lift overflow-hidden`}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-white flex-1 line-clamp-2">{deck.title}</h3>
          <div className="bg-white bg-opacity-30 rounded-full px-3 py-1 ml-2 backdrop-blur-sm">
            <span className="text-white text-sm font-bold">{deck.cards?.length || 0}</span>
          </div>
        </div>
        
        <p className="text-white text-opacity-90 mb-4 line-clamp-2 text-sm">{deck.description || 'No description'}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-white text-opacity-75 text-xs">
            <span>📚 {deck.cards?.length || 0} Cards</span>
          </div>
          
          {showActions && (
            <div className="flex gap-2 animate-fadeInUp">
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover-lift"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover-lift"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
};

export default DeckCard;