import axios from 'axios';

const API_URL = 'http://localhost:5004/groupes';

export const getGroupes = () => axios.get(API_URL);
export const createGroupe = (data) => axios.post(API_URL, data);
export const updateGroupe = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteGroupe = (id) => axios.delete(`${API_URL}/${id}`);
