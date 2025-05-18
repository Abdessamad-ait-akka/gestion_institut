import axios from 'axios';

const API_URL = 'http://localhost:3000/api/emplois';

export const getEmplois = async () => (await axios.get(API_URL)).data;
export const createEmploi = async (data) => (await axios.post(API_URL, data)).data;
export const updateEmploi = async (id, data) => (await axios.put(`${API_URL}/${id}`, data)).data;
export const deleteEmploi = async (id) => (await axios.delete(`${API_URL}/${id}`)).data;
export const getEmploiById = async (id) => (await axios.get(`${API_URL}/${id}`)).data;
