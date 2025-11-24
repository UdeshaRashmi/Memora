import React, { useState } from 'react';

const Flashcard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const gradients = [
    'gradient-primary',
    'gradient-secondary',
    'gradient-success',
    'gradient-warning'
  ];
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`w-72 h-48 perspective-1000 cursor-pointer mx-auto my-4 transition-all duration-300 hover-lift`}
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className={`absolute w-full h-full backface-hidden ${gradient} rounded-2xl shadow-2xl flex items-center justify-center p-6 flex-col`}>
          <div className="text-white text-sm font-medium mb-3 opacity-75">Question</div>
          <p className="text-white text-lg font-bold text-center leading-relaxed">{card.front}</p>
          <div className="mt-4 text-white text-xs opacity-60">Click to reveal</div>
        </div>
        <div className={`absolute w-full h-full backface-hidden bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-2xl flex items-center justify-center p-6 flex-col rotate-y-180`}>
          <div className="text-white text-sm font-medium mb-3 opacity-75">Answer</div>
          <p className="text-white text-lg font-bold text-center leading-relaxed">{card.back}</p>
          <div className="mt-4 text-white text-xs opacity-60">Click to flip</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;