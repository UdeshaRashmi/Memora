import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeck } from '../context/DeckContext';
import { useProgress } from '../context/ProgressContext';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';

const StudyMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDeckById } = useDeck();
  const { addStudySession } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardStates, setCardStates] = useState({});
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const loadDeck = async () => {
      const deckData = await getDeckById(id);
      setDeck(deckData);
      const initialStates = {};
      deckData?.cards?.forEach(card => {
        initialStates[card.id] = null;
      });
      setCardStates(initialStates);
      setLoading(false);
    };
    loadDeck();
  }, [id, getDeckById]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (completed) return;
      const key = e.key.toLowerCase();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (key === 'g') markCardAsKnown();
      if (key === 'r') markCardForReview();
      if (e.key === ' ') {
        e.preventDefault();
        const flashcard = document.querySelector('.flip-card-3d');
        if (flashcard) flashcard.classList.toggle('flipped');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, completed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Deck not found</h2>
            <button
              onClick={() => navigate('/decks')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cards = deck.cards || [];
  const currentCard = cards[currentIndex];

  useEffect(() => {
    // Record study session when component unmounts
    return () => {
      if (currentIndex > 0) {
        const duration = Math.floor((Date.now() - startTime) / 60000); // in minutes
        addStudySession({
          deckId: deck.id,
          deckTitle: deck.title,
          cardsStudied: currentIndex + 1,
          totalCards: cards.length,
          duration,
          completed
        });
      }
    };
  }, [currentIndex, startTime, deck, cards.length, completed, addStudySession]);

  const handleNext = async () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
      const duration = Math.floor((Date.now() - startTime) / 60000);
      await addStudySession({
        deckId: deck.id,
        deckTitle: deck.title,
        cardsStudied: cards.length,
        totalCards: cards.length,
        duration,
        completed: true
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompleted(false);
    const initialStates = {};
    cards.forEach(card => {
      initialStates[card.id] = null;
    });
    setCardStates(initialStates);
  };

  const markCardAsKnown = () => {
    if (currentCard) {
      setCardStates(prev => ({ ...prev, [currentCard.id]: 'known' }));
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const markCardForReview = () => {
    if (currentCard) {
      setCardStates(prev => ({ ...prev, [currentCard.id]: 'review' }));
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const getCardStats = () => {
    const known = Object.values(cardStates).filter(v => v === 'known').length;
    const review = Object.values(cardStates).filter(v => v === 'review').length;
    return { known, review, unmarked: cards.length - known - review };
  };

  if (completed) {
    const duration = Math.floor((Date.now() - startTime) / 60000);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-3xl mx-auto py-12 px-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 rounded-2xl shadow-2xl dark:shadow-gray-900 p-12 text-center text-white mb-8">
            <h1 className="text-5xl font-bold mb-4">🎉 Study Complete!</h1>
            <p className="text-xl text-purple-100 dark:text-purple-200 mb-8">You've finished studying <span className="font-bold">{deck.title}</span></p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">⏱️</div>
                <p className="text-purple-100 dark:text-purple-200 text-sm mt-2">{duration} min</p>
                <p className="text-white text-xs">Duration</p>
              </div>
              <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">📚</div>
                <p className="text-purple-100 dark:text-purple-200 text-sm mt-2">{cards.length}</p>
                <p className="text-white text-xs">Cards</p>
              </div>
              <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">✅</div>
                <p className="text-purple-100 dark:text-purple-200 text-sm mt-2">{stats.known}</p>
                <p className="text-white text-xs">Known</p>
              </div>
              <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">📋</div>
                <p className="text-purple-100 dark:text-purple-200 text-sm mt-2">{stats.review}</p>
                <p className="text-white text-xs">Review</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(`/deck/${id}`)}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg font-bold hover:bg-purple-50 dark:hover:bg-gray-700 transition-all"
              >
                📖 View Deck
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="px-6 py-3 bg-purple-700 dark:bg-purple-900 text-white rounded-lg font-bold hover:bg-purple-800 dark:hover:bg-purple-800 transition-all"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-indigo-500 dark:bg-indigo-700 text-white rounded-lg font-bold hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all"
              >
                🔄 Study Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = (currentIndex / cards.length) * 100;
  const stats = getCardStats();

  return (
    <div className="study-mode min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <header className="study-header gradient-success dark:from-cyan-900 dark:to-blue-900 shadow-2xl dark:shadow-gray-900 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🎓 Study Mode</h1>
              <p className="text-cyan-100 mt-1">Deck: {deck.title}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3 backdrop-blur-sm">
                <p className="text-white font-bold text-sm">✅ Known: <span className="text-lg">{stats.known}</span></p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3 backdrop-blur-sm">
                <p className="text-white font-bold text-sm">📋 Review: <span className="text-lg">{stats.review}</span></p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 backdrop-blur-sm">
                <p className="text-white font-bold text-xl">Card {currentIndex + 1} / {cards.length}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3 backdrop-blur-sm">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-sm mt-2">{Math.round(progress)}% Complete</p>
        </div>
      </header>
      
      <div className="study-area py-12 px-4 max-w-3xl mx-auto">
        <div className="mb-12 animate-fadeInUp">
          <Flashcard card={currentCard} />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={markCardAsKnown}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all duration-200 hover-lift"
            >
              ✅ Known
            </button>
            <button
              onClick={markCardForReview}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-all duration-200 hover-lift"
            >
              📋 Review
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                currentIndex === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white hover-lift'
              }`}
            >
              ⬅️ Prev
            </button>
            <button
              onClick={handleNext}
              className="btn-gradient text-white font-bold py-3 rounded-lg transition-all duration-200 hover-lift"
            >
              {currentIndex === cards.length - 1 ? '✅ Finish' : 'Next ➡️'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-lg p-3 text-center text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">⌨️ Shortcuts:</span> ← → arrows to navigate | Space to flip | ✅ G for known | 📋 R for review
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">You've studied <span className="font-bold text-indigo-600">{currentIndex + 1}</span> of <span className="font-bold text-indigo-600">{cards.length}</span> cards</p>
        </div>
      </div>
    </div>
  );
};

export default StudyMode;