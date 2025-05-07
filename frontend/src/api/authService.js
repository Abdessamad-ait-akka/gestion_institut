// src/api/authService.js
import axios from 'axios';

// URL du microservice d'authentification
const API_URL = 'http://localhost:5000/api/auth'; // Remplace par l'URL de ton microservice

// Fonction de connexion
export const login = async (email, motDePasse) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password: motDePasse,
    });

    // Sauvegarde du token dans le localStorage
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
};

// Fonction de déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Vérification du token JWT
export const getToken = () => {
  return localStorage.getItem('token');
};

// Vérification de l'utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Fonction pour vérifier le rôle de l'utilisateur
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return getToken() != null;
};
