import React, { useState, useEffect } from 'react';
import {
  getGroupes, createGroupe, updateGroupe, deleteGroupe,
  getFilieres, createFiliere, deleteFiliere,
  getMatieres, createMatiere, deleteMatiere
} from '../api/groupeService';

const GroupeCrud = () => {
  const [groupes, setGroupes] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [nom, setNom] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nom_filiere: '',
    annee: '',
    matiere_id: '',
    nom_matiere: '',
    enseignant_id: ''
  });

  useEffect(() => {
    fetchGroupes();
    fetchFilieres();
    fetchMatieres();
  }, []);

  const fetchGroupes = async () => setGroupes((await getGroupes()).data);
  const fetchFilieres = async () => setFilieres((await getFilieres()).data);
  const fetchMatieres = async () => setMatieres((await getMatieres()).data);

  const handleGroupeSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateGroupe(editingId, { nom });
      setEditingId(null);
    } else {
      await createGroupe({ nom });
    }
    setNom('');
    fetchGroupes();
  };

  const handleEdit = (g) => {
    setNom(g.nom_groupe);
    setEditingId(g.id);
  };

  const handleFiliereSubmit = async (e) => {
    e.preventDefault();
    await createFiliere(form);
    setForm({ ...form, nom_filiere: '', annee: '', matiere_id: '' });
    fetchFilieres();
  };

  const handleMatiereSubmit = async (e) => {
    e.preventDefault();
    await createMatiere(form);
    setForm({ ...form, nom_matiere: '', enseignant_id: '' });
    fetchMatieres();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{editingId ? 'Modifier un groupe' : 'Créer un groupe'}</h2>
      <form onSubmit={handleGroupeSubmit}>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom du groupe"
        />
        <button type="submit">{editingId ? 'Mettre à jour' : 'Créer'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setNom(''); }}>Annuler</button>}
      </form>

      <ul>
        {groupes.map(g => (
          <li key={g.id}>
            {g.nom_groupe}
            <button onClick={() => handleEdit(g)}>✏️</button>
            <button onClick={() => deleteGroupe(g.id).then(fetchGroupes)}>🗑️</button>
          </li>
        ))}
      </ul>

      <h2>Filières</h2>
      <form onSubmit={handleFiliereSubmit}>
        <input
          placeholder="Nom Filière"
          value={form.nom_filiere}
          onChange={e => setForm({ ...form, nom_filiere: e.target.value })}
        />
        <input
          type="date"
          placeholder="Année"
          value={form.annee}
          onChange={e => setForm({ ...form, annee: e.target.value })}
        />

        {/* Sélection dynamique de la matière */}
        <select
          value={form.matiere_id}
          onChange={e => setForm({ ...form, matiere_id: e.target.value })}
        >
          <option value="">-- Sélectionner une matière --</option>
          {matieres.map(m => (
            <option key={m.id} value={m.id}>{m.nom_matiere}</option>
          ))}
        </select>

        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {filieres.map(f => (
          <li key={f.id}>
            {f.nom_filiere} — {f.annee} — Matière ID: {f.matiere_id}
            <button onClick={() => deleteFiliere(f.id).then(fetchFilieres)}>🗑️</button>
          </li>
        ))}
      </ul>

      <h2>Matières</h2>
      <form onSubmit={handleMatiereSubmit}>
        <input
          placeholder="Nom Matière"
          value={form.nom_matiere}
          onChange={e => setForm({ ...form, nom_matiere: e.target.value })}
        />

        {/* Vous pouvez remplacer ceci par un select dynamique si vous avez une API enseignants */}
        <input
          placeholder="Enseignant ID"
          value={form.enseignant_id}
          onChange={e => setForm({ ...form, enseignant_id: e.target.value })}
        />

        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {matieres.map(m => (
          <li key={m.id}>
            {m.nom_matiere} — Enseignant ID: {m.enseignant_id}
            <button onClick={() => deleteMatiere(m.id).then(fetchMatieres)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupeCrud;
