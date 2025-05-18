import axios from 'axios';

const API_URL = 'http://localhost:5005/api';

const getToken = () => localStorage.getItem('token');
const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getEvents = async (userId) => {
  const response = await axios.get(`${API_URL}/events/${userId}`, authHeader());
  return response.data;
};

export const createEvent = async (event) => {
  const response = await axios.post(`${API_URL}/events`, event, authHeader());
  return response.data;
};

export const updateEvent = async (eventId, event) => {
  const response = await axios.put(`${API_URL}/events/${eventId}`, event, authHeader());
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await axios.delete(`${API_URL}/events/${eventId}`, authHeader());
  return response.data;
};
