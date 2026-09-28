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
  // Send chat message to TripPilot Agent
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
