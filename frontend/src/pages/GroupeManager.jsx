import React, { useState, useEffect } from 'react';
import { getGroupes, createGroupe, updateGroupe, deleteGroupe } from '../api/groupeService';

const GroupeCrud = () => {
  const [groupes, setGroupes] = useState([]);
  const [nom, setNom] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchGroupes = async () => {
    try {
      const res = await getGroupes();
      setGroupes(res.data);
    } catch (err) {
      console.error('Erreur de récupération:', err);
    }
  };

  useEffect(() => {
    fetchGroupes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateGroupe(editingId, { nom });
        setEditingId(null);
      } else {
        await createGroupe({ nom });
      }
      setNom('');
      fetchGroupes();
    } catch (err) {
      console.error('Erreur d\'envoi:', err);
    }
  };

  const handleEdit = (groupe) => {
    setNom(groupe.nom_groupe);
    setEditingId(groupe.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGroupe(id);
      fetchGroupes();
    } catch (err) {
      console.error('Erreur de suppression:', err);
    }
  };

  return (
    <div>
      <h2>{editingId ? 'Modifier un groupe' : 'Créer un groupe'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du groupe"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Mettre à jour' : 'Créer'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setNom(''); }}>Annuler</button>}
      </form>

      <h3>Liste des groupes</h3>
      <ul>
        {groupes.map((g) => (
          <li key={g.id}>
            {g.nom_groupe}
            <button onClick={() => handleEdit(g)}>✏️</button>
            <button onClick={() => handleDelete(g.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupeCrud;
