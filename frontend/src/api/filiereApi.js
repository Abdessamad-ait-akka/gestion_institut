// src/api/filiereApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5006/api/filieres';

export const fetchFilieres = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createFiliere = async (filiere) => {
  const res = await axios.post(API_URL, filiere);
  return res.data;
};

export const updateFiliere = async (id, filiere) => {
  const res = await axios.put(`${API_URL}/${id}`, filiere);
  return res.data;
};

export const deleteFiliere = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};



