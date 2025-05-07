import axios from 'axios';
import { getCurrentUser } from './authService'; // ou l’endroit où tu l’as défini

export const getEvents = (userId) => axios.get(`http://localhost:5005/api/events/${userId}`).then(res => res.data);
export const createEvent = async (eventData) => {
    const user = getCurrentUser(); // récupère l'utilisateur connecté
  
    if (!user || !user.id) {
      throw new Error("Utilisateur non connecté ou ID manquant");
    }
  
    const event = {
      ...eventData,
      user_id: user.id, // ID réel de l'utilisateur
    };
  
    return axios.post('http://localhost:5005/api/events', event);
  };
  
export const updateEvent = (id, event) => axios.put(`http://localhost:5005/api/events/${id}`, event);
export const deleteEvent = (id) => axios.delete(`http://localhost:5005/api/events/${id}`);
