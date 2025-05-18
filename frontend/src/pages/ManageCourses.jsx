import React, { useState } from 'react';
import { uploadCours } from '../api/courseService';

const CoursForm = ({ userId, token }) => {
  const [titre, setTitre] = useState('');

  const [fichier, setFichier] = useState(null);
  const [filiereId, setFiliereId] = useState('');
  const [matiereId, setMatiereId] = useState('');
  const [groupes, setGroupes] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !fichier || !filiereId || !matiereId || groupes.length === 0) {
      setMessage("Tous les champs sont requis.");
      return;
    }

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('filiere_id', filiereId);
    formData.append('matiere_id', matiereId);
    formData.append('groupes', groupes);
    formData.append('fichier', fichier);

    try {
      const response = await fetch('/cours', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Cours ajouté avec succès !");
      } else {
        setMessage(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      setMessage("Erreur lors de l'envoi du cours.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter un cours</h3>
      <div>
        <label>Titre :</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Filière :</label>
        <input
          type="text"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Matière :</label>
        <input
          type="text"
          value={matiereId}
          onChange={(e) => setMatiereId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Groupes :</label>
        <input
          type="text"
          value={groupes}
          onChange={(e) => setGroupes(e.target.value.split(','))}
          required
        />
      </div>
      <div>
        <label>Fichier :</label>
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit">Envoyer</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CoursForm;
