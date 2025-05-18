import axios from 'axios';

const API_URL = 'http://localhost:5010/api/auth';

// Connexion
export const login = async (email, motDePasse) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      mot_de_passe: motDePasse,
    });

    const { token, ...user } = response.data;

    if (!user.role) {
      throw new Error("Rôle utilisateur non défini");
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
};

// Récupérer le token
export const getToken = () => localStorage.getItem('token');

// Utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Vérifie la connexion
export const isAuthenticated = () => !!getToken();

// Rôle utilisateur
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/*
import axios from 'axios';

const API_URL = 'http://localhost:5010/api/auth'; // URL du microservice d'authentification

// Fonction de connexion
export const login = async (email, motDePasse) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {  // Correction avec backticks
      email,
      mot_de_passe: motDePasse,
    });

    const { token, ...user } = response.data;

    if (!user.role) {
      throw new Error("Rôle utilisateur non défini");
    }

    // Sauvegarde dans le localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
};

// Récupérer le token
export const getToken = () => localStorage.getItem('token');

// Récupérer l'utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => !!getToken();

// Obtenir le rôle utilisateur
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

*/