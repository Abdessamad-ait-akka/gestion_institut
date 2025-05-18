// src/api/matiereService.js
import axios from 'axios';

const API_URL = 'http://localhost:5008/api/matieres';
const FILIERE_URL = 'http://localhost:5006/api/filieres';

export const getMatieres = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getFilieres = async () => {
  const res = await axios.get(FILIERE_URL);
  return res.data;
};

export const createMatiere = async (matiere) => {
  const res = await axios.post(API_URL, matiere);
  return res.data;
};

export const updateMatiere = async (id, matiere) => {
  const res = await axios.put(`${API_URL}/${id}`, matiere);
  return res.data;
};

export const deleteMatiere = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
