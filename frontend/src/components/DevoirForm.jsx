

import React, { useState } from 'react';
import axios from 'axios';

const DevoirForm = () => {
  const [titre, setTitre] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [fichier, setFichier] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!titre || !dateLimite || !fichier) {
      setMessage('Tous les champs sont requis');
      return;
    }

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('date_limite', dateLimite);
    formData.append('fichier', fichier);

    try {
      const response = await axios.post('http://localhost:5003/devoirs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erreur lors de l\'envoi');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un Devoir</h2>
      <input
        type="text"
        placeholder="Titre"
        value={titre}
        onChange={e => setTitre(e.target.value)}
      /><br />
      <input
        type="date"
        value={dateLimite}
        onChange={e => setDateLimite(e.target.value)}
      /><br />
      <input
        type="file"
        onChange={e => setFichier(e.target.files[0])}
      /><br />
      <button type="submit">Envoyer</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DevoirForm;
