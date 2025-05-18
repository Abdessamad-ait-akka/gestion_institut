import axios from 'axios';

const API = 'http://localhost:5004';

export const getGroupes = () => axios.get(`${API}/groupes/`);
export const createGroupe = (data) => axios.post(`${API}/groupes/`, data);
export const updateGroupe = (id, data) => axios.put(`${API}/groupes/${id}`, data);
export const deleteGroupe = (id) => axios.delete(`${API}/groupes/${id}`);

export const getFilieres = () => axios.get(`${API}/filieres/`);
export const createFiliere = (data) => axios.post(`${API}/filieres/`, data);
export const deleteFiliere = (id) => axios.delete(`${API}/filieres/${id}`);

export const getMatieres = () => axios.get(`${API}/matieres/`);
export const createMatiere = (data) => axios.post(`${API}/matieres/`, data);
export const deleteMatiere = (id) => axios.delete(`${API}/matieres/${id}`);
