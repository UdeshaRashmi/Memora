import React, { createContext, useContext, useState, useEffect } from 'react';

const DeckContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export const useDeck = () => {
  return useContext(DeckContext);
};

export const DeckProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await fetch(`${API_BASE}/decks`);
      const data = await response.json();
      setDecks(data);
    } catch (error) {
      console.error('Failed to fetch decks:', error);
      setDecks([]);
    } finally {
      setLoading(false);
    }
  };

  const addDeck = async (deck) => {
    try {
      const response = await fetch(`${API_BASE}/decks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deck)
      });
      const newDeck = await response.json();
      setDecks([...decks, newDeck]);
      return newDeck;
    } catch (error) {
      console.error('Failed to add deck:', error);
    }
  };

  const updateDeck = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/decks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await response.json();
      setDecks(decks.map(d => d.id === id ? { ...d, ...updated } : d));
      return updated;
    } catch (error) {
      console.error('Failed to update deck:', error);
    }
  };

  const deleteDeck = async (id) => {
    try {
      await fetch(`${API_BASE}/decks/${id}`, { method: 'DELETE' });
      setDecks(decks.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete deck:', error);
    }
  };

  const getDeckById = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/decks/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch deck:', error);
      return null;
    }
  };

  const addCard = async (deckId, card) => {
    try {
      const response = await fetch(`${API_BASE}/decks/${deckId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const updateCard = async (deckId, cardId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/decks/${deckId}/cards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  const deleteCard = async (deckId, cardId) => {
    try {
      await fetch(`${API_BASE}/decks/${deckId}/cards/${cardId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const value = {
    decks,
    loading,
    addDeck,
    updateDeck,
    deleteDeck,
    getDeckById,
    addCard,
    updateCard,
    deleteCard
  };

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  );
};