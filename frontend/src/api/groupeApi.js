// src/api/groupeApi.js
import axios from 'axios';

const GROUPE_API_URL = 'http://localhost:5007/api/groupes';
const FILIERE_API_URL = 'http://localhost:5006/api/filieres';

export const fetchGroupes = async () => {
  const res = await axios.get(GROUPE_API_URL);
  return res.data;
};

export const fetchFilieres = async () => {
  const res = await axios.get(FILIERE_API_URL);
  return res.data;
};

export const createGroupe = async (groupe) => {
  const res = await axios.post(GROUPE_API_URL, groupe);
  return res.data;
};

export const updateGroupe = async (id, groupe) => {
  const res = await axios.put(`${GROUPE_API_URL}/${id}`, groupe);
  return res.data;
};

export const deleteGroupe = async (id) => {
  await axios.delete(`${GROUPE_API_URL}/${id}`);
};
