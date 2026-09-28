import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

export const apiService = {
  // Send chat message (standard REST)
  async sendMessage({ message, sessionId, destination, durationDays, travelStyle }) {
    const payload = {
      message,
      session_id: sessionId || null,
      destination: destination || null,
      duration_days: durationDays ? parseInt(durationDays, 10) : null,
      travel_style: travelStyle || null,
    };
    const response = await apiClient.post('/chat', payload);
    return response.data;
  },

  // Real-time SSE Streaming Chat
  async streamMessage({
    message,
    sessionId,
    destination,
    durationDays,
    travelStyle,
    onThought,
    onToolStart,
    onToolEnd,
    onToken,
    onTripPlan,
    onDone,
    onError
  }) {
    const payload = {
      message,
      session_id: sessionId || null,
      destination: destination || null,
      duration_days: durationDays ? parseInt(durationDays, 10) : null,
      travel_style: travelStyle || null,
    };

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep partial

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.event === 'thought' && onThought) onThought(data.text);
              else if (data.event === 'tool_start' && onToolStart) onToolStart(data.tool, data.text);
              else if (data.event === 'tool_end' && onToolEnd) onToolEnd(data.tool, data.text);
              else if (data.event === 'token' && onToken) onToken(data.text);
              else if (data.event === 'trip_plan' && onTripPlan) onTripPlan(data.data);
              else if (data.event === 'done' && onDone) onDone(data.session_id);
              else if (data.event === 'error' && onError) onError(data.message);
            } catch (err) {
              console.warn('Failed to parse SSE payload:', trimmed, err);
            }
          }
        }
      }
    } catch (err) {
      if (onError) onError(err.message || 'Stream connection interrupted');
    }
  },

  // Direct trip generation
  async generateTrip(destination, durationDays = 3, travelStyle = 'moderate') {
    const response = await apiClient.post(
      `/trips/generate?destination=${encodeURIComponent(destination)}&duration_days=${durationDays}&travel_style=${travelStyle}&save_to_db=true`
    );
    return response.data;
  },

  // Trip CRUD
  async getSavedTrips() {
    const response = await apiClient.get('/trips');
    return response.data;
  },

  async getTripById(tripId) {
    const response = await apiClient.get(`/trips/${tripId}`);
    return response.data;
  },

  async saveTrip(tripPlan) {
    const response = await apiClient.post('/trips', tripPlan);
    return response.data;
  },

  async deleteTrip(tripId) {
    const response = await apiClient.delete(`/trips/${tripId}`);
    return response.data;
  },

  // Currency
  async getExchangeRates() {
    const response = await apiClient.get('/currency/rates');
    return response.data;
  },

  // Sessions
  async getSessions() {
    const response = await apiClient.get('/chat/sessions');
    return response.data;
  },

  async getSessionMessages(sessionId) {
    const response = await apiClient.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  // System Health
  async getHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  }
};
