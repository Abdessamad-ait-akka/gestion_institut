import axios from 'axios';

const API_URL = 'http://localhost:5001';

// Fonction pour obtenir la liste des cours
export const getCoursList = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/cours`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    throw error;
  }
};

// Fonction pour uploader un cours
export const uploadCours = async (formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/cours`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'upload du cours:', error);
    throw error;
  }
};

 export const deleteFichier = async (coursId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${API_URL}/cours/${coursId}/fichier`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Réponse du serveur:', response.data); // Vérifier la réponse
    return response.data;
  } catch (error) {
    console.error('Erreur du serveur:', error.response?.data || error.message);
    throw error;
  }
};


// Fonction pour télécharger un fichier de cours
export const downloadCours = async (filename) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/cours/download/${filename}`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Erreur lors du téléchargement du cours:', error);
  }
};
