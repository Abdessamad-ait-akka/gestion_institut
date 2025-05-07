import axios from 'axios';

const API_URL = 'http://localhost:5003';

// Récupérer les devoirs
export const getDevoirsList = async () => {
  const response = await axios.get(`${API_URL}/devoirs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

// Télécharger un fichier
export const downloadDevoir = async (filename) => {
  const response = await axios.get(`${API_URL}/devoirs/download/${filename}`, {
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
  const response = await axios.delete(`${API_URL}/devoir/${devoirId}/fichier`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

// Uploader un devoir
export const uploadDevoir = async (formData) => {
  const response = await axios.post(`${API_URL}/devoir`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Soumettre un devoir
export const submitDevoir = async (devoirId, formData) => {
  const response = await axios.post(`${API_URL}/devoir/${devoirId}/soumettre`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Récupérer les devoirs rendus
export const getDevoirsRendus = async () => {
  const response = await axios.get(`${API_URL}/devoirs/rendus`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

// Attribuer une note
export const attribuerNote = async (devoirId, note) => {
  const response = await axios.patch(`${API_URL}/devoirs/${devoirId}/note`, { note }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
