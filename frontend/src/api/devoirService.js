import axios from 'axios';

const API_URL1 = 'http://localhost:5003';

// Récupérer les devoirs
export const getDevoirsList = async () => {
  const response = await axios.get(`${API_URL1}/devoirs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

// Télécharger un fichier
export const downloadDevoir = async (filename) => {
  const response = await axios.get(`${API_URL1}/devoirs/download/${filename}`, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Supprimer un devoir
export const deleteFichierDevoir = async (devoirId) => {
  const response = await axios.delete(`${API_URL1}/devoir/${devoirId}/fichier`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

// Uploader un devoir
export const uploadDevoir = async (formData) => {
  const response = await axios.post(`${API_URL1}/devoir`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Soumettre un devoir
export const submitDevoir = async (devoirId, formData) => {
  const response = await axios.post(`${API_URL1}/devoir/${devoirId}/soumettre`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Récupérer les devoirs rendus
export const getDevoirsRendus = async () => {
  const response = await axios.get(`${API_URL1}/devoirs/rendus`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

// Attribuer une note
export const attribuerNote = async (devoirId, note) => {
  const response = await axios.patch(`${API_URL1}/devoirs/${devoirId}/note`, { note }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};



// src/api/devoirService.js


const BASE_URL = 'http://localhost:5003/api/devoirs';

export const getDevoirsParEnseignant = (enseignantId) => {
  return axios.get(`${BASE_URL}/enseignant/${enseignantId}`);
};

export const creerDevoir = (formData) => {
  return axios.post(`${BASE_URL}/create`, formData);
};

export const supprimerDevoir = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

export const getSoumissionsParDevoir = (devoirId) => {
  return axios.get(`${BASE_URL}/soumissions/${devoirId}`);
};

export const telechargerDevoir = (filename) => {
  window.open(`${BASE_URL}/telecharger/${filename}`, '_self');
};

export const telechargerSoumission = (filepath) => {
  const filename = filepath.split('/').pop();
  const url = `${BASE_URL}/telecharger/soumission/${filename}`;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



export const getDevoirsActifsParGroupe = async (groupeId) => {
  const response = await axios.get(`${BASE_URL}/actifs/${groupeId}`);
  return response.data;
};

export const soumettreDevoir = async (formData) => {
  const response = await axios.post(`${BASE_URL}/soumettre`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getLienTelechargement = (fichier) => {
  return `${BASE_URL}/telecharger/${fichier}`;
};
