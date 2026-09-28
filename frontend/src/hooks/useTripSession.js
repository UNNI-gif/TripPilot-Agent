import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export function useTripSession() {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('trippilot_session_id') || '';
  });
  const [messages, setMessages] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync session id to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('trippilot_session_id', sessionId);
    }
  }, [sessionId]);

  // Load saved trips on mount
  const refreshSavedTrips = useCallback(async () => {
    try {
      const trips = await apiService.getSavedTrips();
      setSavedTrips(trips);
    } catch (err) {
      console.error('Failed to load saved trips:', err);
    }
  }, []);

  useEffect(() => {
    refreshSavedTrips();
  }, [refreshSavedTrips]);

  // Send message
  const sendMessage = async (userText, options = {}) => {
    if (!userText.trim()) return;

    const optimisticMsg = {
      id: Date.now(),
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiService.sendMessage({
        message: userText,
        sessionId,
        destination: options.destination,
        durationDays: options.durationDays,
        travelStyle: options.travelStyle,
      });

      if (res.session_id && res.session_id !== sessionId) {
        setSessionId(res.session_id);
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply,
        trip_data: res.trip_plan,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (res.trip_plan) {
        setCurrentTrip(res.trip_plan);
        refreshSavedTrips();
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.response?.data?.detail || 'Failed to communicate with TripPilot. Please verify server connection.');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '⚠️ Apologies, I encountered a temporary connection glitch. Please check your internet or retry.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new conversation / clear trip
  const startNewTrip = () => {
    const newId = 'session_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newId);
    setMessages([]);
    setCurrentTrip(null);
    setError(null);
  };

  // Load a saved trip into the active workspace
  const loadSavedTrip = async (tripId) => {
    setIsLoading(true);
    try {
      const fullTrip = await apiService.getTripById(tripId);
      setCurrentTrip(fullTrip);
    } catch (err) {
      console.error('Failed to load trip:', err);
      setError('Could not load the requested trip.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a saved trip
  const deleteSavedTrip = async (tripId) => {
    try {
      await apiService.deleteTrip(tripId);
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }
      refreshSavedTrips();
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  return {
    sessionId,
    messages,
    currentTrip,
    savedTrips,
    isLoading,
    error,
    sendMessage,
    startNewTrip,
    loadSavedTrip,
    deleteSavedTrip,
    refreshSavedTrips,
    setCurrentTrip,
  };
}
