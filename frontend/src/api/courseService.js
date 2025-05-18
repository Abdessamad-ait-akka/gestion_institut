import axios from 'axios';

const API_URL = 'http://localhost:5001/api/cours';

export const uploadCours = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getCoursByUser = async (userId) => {
  const res = await axios.get(`${API_URL}/${userId}`);
  return res.data;
};

export const getCoursByEtudiant = async (etudiantId) => {
  const res = await axios.get(`${API_URL}/etudiant/${etudiantId}`);
  return res.data;
};










//etudiant service
const API_BASE_URL = 'http://localhost:5001/api/cours/etudiant';

export const getCoursEtudiant = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des cours.");
  }
};

export const downloadFichier = async (fichier) => {
  try {
    const url = `http://localhost:5001/uploads/${fichier}`;
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const disposition = response.headers['content-disposition'];
    let filename = fichier;

    if (disposition && disposition.includes('filename=')) {
      filename = disposition
        .split('filename=')[1]
        .split(';')[0]
        .replace(/"/g, '');
    }

    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    throw new Error("Erreur lors du téléchargement du fichier");
  }
};



// cours des enseingnant 

import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/cours';

export const getCoursByEnseignant = async (enseignantId) => {
  const response = await axios.get(`${BASE_URL}/enseignant/${enseignantId}`);
  return response.data;
};

export const deleteCours = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const downloadCoursFile = async (fichier) => {
  const url = `http://localhost:5001/uploads/${fichier}`;
  const response = await axios.get(url, { responseType: 'blob' });
  return { data: response.data, contentType: response.headers['content-type'] };
};
