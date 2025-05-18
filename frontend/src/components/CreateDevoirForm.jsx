import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/authService';
import axios from 'axios';
import { creerDevoir } from '../api/devoirService';
import { FiFilePlus, FiEdit, FiCalendar, FiAlignLeft, FiUsers, FiUpload } from 'react-icons/fi';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const CreateDevoirPage = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [groupeId, setGroupeId] = useState('');
  const [fichier, setFichier] = useState(null);
  const [groupes, setGroupes] = useState([]);

  const [loadingGroupes, setLoadingGroupes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const enseignantId = getCurrentUser()?.id_utilisateur;

  useEffect(() => {
    axios.get('http://localhost:5007/api/groupes')
      .then(res => setGroupes(res.data))
      .catch(console.error)
      .finally(() => setLoadingGroupes(false));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!fichier) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('titre', titre);
    fd.append('description', description);
    fd.append('date_limite', dateLimite);
    fd.append('enseignant_id', enseignantId);
    fd.append('groupe_id', groupeId);
    fd.append('fichier', fichier);

    try {
      await creerDevoir(fd);
      alert('Devoir créé 👍');
      setTitre(''); setDescription(''); setDateLimite(''); setGroupeId(''); setFichier(null);
    } catch {
      alert('Erreur lors de la création ❌');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGroupes) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <h2 className="text-3xl font-semibold mb-6 text-blue-800 flex items-center gap-2">
            <FiFilePlus className="text-4xl text-blue-800" />
            Créer un devoir
          </h2>

          <div className="w-full bg-white p-8 rounded-lg border border-blue-500 shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ligne 1 : Titre + Date limite */}
              <div className="grid grid-cols-2 gap-4">
                {/* Titre */}
                <div className="relative">
                  <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
                      <FiEdit />
                    </span>
                    <input
                      id="titre"
                      type="text"
                      value={titre}
                      onChange={e => setTitre(e.target.value)}
                      required
                      className="block w-full border border-blue-500 h-24 rounded-md pl-10 pr-3 py-2"
                      placeholder="Entrez le titre du devoir"
                    />
                  </div>
                </div>


                <div className="relative">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <span className="absolute top-2 left-3 text-blue-500">
                      <FiAlignLeft />
                    </span>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="block w-full border border-blue-500 rounded-md pl-10 "
                      placeholder="Détaillez le devoir (optionnel)"
                    />
                  </div>
                </div>
           
              </div>

              {/* Ligne 2 : Description + Groupe */}
              <div className="grid grid-cols-2 gap-4">
                {/* Description */}
             
     {/* Date limite */}
     <div className="relative">
                  <label htmlFor="dateLimite" className="block text-sm font-medium text-gray-700 mb-1">
                    Date limite <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
                      <FiCalendar />
                    </span>
                    <input
                      id="dateLimite"
                      type="datetime-local"
                      value={dateLimite}
                      onChange={e => setDateLimite(e.target.value)}
                      required
                      className="block w-full border border-blue-500 rounded-md pl-10 pr-3 h-10"
                    />
                  </div>
                </div>


                {/* Groupe */}
                <div className="relative">
                  <label htmlFor="groupe" className="block text-sm font-medium text-gray-700 mb-1">
                    Groupe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
                      <FiUsers />
                    </span>
                    <select
                      id="groupe"
                      value={groupeId}
                      onChange={e => setGroupeId(e.target.value)}
                      required
                      className="block w-full border border-blue-500 h-10 rounded-md pl-10 pr-3 py-2"
                    >
                      <option value="">— Sélectionnez un groupe —</option>
                      {groupes.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.nom_groupe}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ligne 3 : Fichier (seul) */}
              <div className="relative">
                <label htmlFor="fichier" className="block text-sm font-medium text-gray-700 mb-1">
                  Fichier <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
                    <FiUpload />
                  </span>
                  <input
                    id="fichier"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={e => setFichier(e.target.files[0])}
                    required
                    className="block w-full border border-blue-500 rounded-md pl-10 pr-3 py-2 text-gray-700"
                  />
                </div>
              </div>

              {/* Bouton */}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    submitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {submitting ? 'Création en cours...' : 'Créer le devoir'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateDevoirPage;
