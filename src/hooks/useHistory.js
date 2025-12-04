import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nandini-ai-history';
const MAX_HISTORY_ITEMS = 50;

export const useHistory = () => {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  }, [history]);

  // Add a new item to history
  const addToHistory = (question, response) => {
    const newItem = {
      id: Date.now(),
      question,
      response,
      timestamp: new Date().toISOString(),
    };

    setHistory(prev => {
      // Add to beginning, limit to max items
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });

    return newItem.id;
  };

  // Remove a single item from history
  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Get a specific item by id
  const getHistoryItem = (id) => {
    return history.find(item => item.id === id);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryItem,
  };
};

export default useHistory;
