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
  const [agentStatus, setAgentStatus] = useState(null); // { type: 'tool' | 'thought', text: string }
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

  // Stream chat message with real-time SSE
  const sendMessage = async (userText, options = {}) => {
    if (!userText.trim()) return;

    const optimisticUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    const assistantMsgId = Date.now() + 1;
    const optimisticAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      trip_data: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg, optimisticAssistantMsg]);
    setIsLoading(true);
    setError(null);
    setAgentStatus({ type: 'thought', text: 'Initializing TripPilot agent...' });

    let accumulatedText = '';
    let receivedPlan = null;

    try {
      await apiService.streamMessage({
        message: userText,
        sessionId,
        destination: options.destination,
        durationDays: options.durationDays,
        travelStyle: options.travelStyle,
        onThought: (thoughtText) => {
          setAgentStatus({ type: 'thought', text: thoughtText });
        },
        onToolStart: (tool, toolText) => {
          setAgentStatus({ type: 'tool', text: toolText, tool });
        },
        onToolEnd: (tool, toolText) => {
          setAgentStatus({ type: 'tool_done', text: toolText, tool });
        },
        onToken: (token) => {
          accumulatedText += token;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
            )
          );
        },
        onTripPlan: (plan) => {
          receivedPlan = plan;
          setCurrentTrip(plan);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, trip_data: plan } : m
            )
          );
          refreshSavedTrips();
        },
        onDone: (newSessionId) => {
          if (newSessionId && newSessionId !== sessionId) {
            setSessionId(newSessionId);
          }
          setAgentStatus(null);
          setIsLoading(false);
        },
        onError: (errText) => {
          console.warn('SSE Error encountered, falling back to REST endpoint:', errText);
          fallbackRestCall(userText, options, assistantMsgId);
        }
      });
    } catch (err) {
      console.warn('Streaming failed, fallback:', err);
      fallbackRestCall(userText, options, assistantMsgId);
    } finally {
      setIsLoading(false);
      setAgentStatus(null);
    }
  };

  // Graceful REST fallback if SSE encounters any proxy blocks
  const fallbackRestCall = async (userText, options, assistantMsgId) => {
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

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: res.reply, trip_data: res.trip_plan }
            : m
        )
      );

      if (res.trip_plan) {
        setCurrentTrip(res.trip_plan);
        refreshSavedTrips();
      }
    } catch (e) {
      setError('Communication error. Please check your connection.');
    }
  };

  // Update active trip state directly (e.g. from editor)
  const updateCurrentTrip = (updatedPlan) => {
    setCurrentTrip(updatedPlan);
    // Optionally update in DB
    if (updatedPlan.id) {
      apiService.saveTrip(updatedPlan).then(() => refreshSavedTrips()).catch(console.error);
    }
  };

  // Start new conversation / clear trip
  const startNewTrip = () => {
    const newId = 'session_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newId);
    setMessages([]);
    setCurrentTrip(null);
    setError(null);
    setAgentStatus(null);
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
    agentStatus,
    error,
    sendMessage,
    updateCurrentTrip,
    startNewTrip,
    loadSavedTrip,
    deleteSavedTrip,
    refreshSavedTrips,
    setCurrentTrip,
  };
}
