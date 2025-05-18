import axios from 'axios';

const API_BASE_URL = 'http://localhost:5009/api'; // correspond à ton backend Flask

// Obtenir tous les utilisateurs
export const fetchUtilisateurs = async () => {
  const response = await axios.get(`${API_BASE_URL}/utilisateurs`);
  return response.data;
};

// Créer un utilisateur
export const createUtilisateur = async (utilisateur) => {
  const response = await axios.post(`${API_BASE_URL}/utilisateurs`, utilisateur);
  return response.data;
};

// Supprimer un utilisateur
export const deleteUtilisateur = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/utilisateurs/${id}`);
  return response.data;
};

// Mettre à jour un utilisateur
export const updateUtilisateur = async (id, utilisateur) => {
  const response = await axios.put(`${API_BASE_URL}/utilisateurs/${id}`, utilisateur);
  return response.data;
};

// Obtenir un utilisateur par ID
export const getUtilisateur = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/utilisateurs/${id}`);
  return response.data;
};

const getUserCounts = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/counts`);

  return response.data;
};


// Export regroupé
export const userApi = {
  fetchUtilisateurs,
  createUtilisateur,
  deleteUtilisateur,
  updateUtilisateur,
  getUtilisateur,
  getUserCounts
};
