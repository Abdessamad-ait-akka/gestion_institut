import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getCurrentUser } from '../api/authService';
import { Book, FileText, Layers, Search } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { FiFilePlus } from 'react-icons/fi';

const UploadCours = () => {
  const [titre, setTitre] = useState('');
  const [filiereId, setFiliereId] = useState('');
  const [matiereId, setMatiereId] = useState('');
  const [groupes, setGroupes] = useState([]);
  const [file, setFile] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [groupesDisponibles, setGroupesDisponibles] = useState([]);
  const fileInputRef = useRef(null);

  const user = getCurrentUser();
  const enseignantId = user?.id_utilisateur;

  useEffect(() => {
    axios.get('http://localhost:5006/api/filieres').then(res => setFilieres(res.data));
    axios.get('http://localhost:5008/api/matieres').then(res => setMatieres(res.data));
    axios.get('http://localhost:5007/api/groupes').then(res => setGroupesDisponibles(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !titre || !filiereId || !matiereId || groupes.length === 0 || !enseignantId) {
      return Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs requis',
      });
    }
  
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('enseignant_id', enseignantId);
    formData.append('filiere_id', filiereId);
    formData.append('matiere_id', matiereId);
    groupes.forEach(gid => formData.append('groupes[]', gid));
    formData.append('fichier', file);
  
    try {
      const res = await axios.post('http://localhost:5001/api/cours', formData);
      Swal.fire({
        icon: 'success',
        title: 'Cours envoyé',
        text: res.data.message || 'Le cours a été envoyé avec succès.',
      });
  
      // Réinitialisation des champs
      setTitre('');
      setFiliereId('');
      setMatiereId('');
      setGroupes([]);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Erreur lors de l'envoi du cours.";
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: msg,
      });
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixée à gauche */}
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Navbar sticky */}
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
        <h2 className="text-3xl font-semibold mb-6 text-blue-800 flex items-center gap-2">
            <FiFilePlus className="text-4xl text-blue-800" />
            Envoiyer un cour
          </h2>
          <div className="bg-white rounded-xl shadow border border-blue-500 p-6 m-8 mt-10">
          
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
  {/* Titre */}
  <div className="md:col-span-1">
    <label className="block text-gray-700 font-medium mb-2">Titre</label>
    <div className="flex items-start border-2 border border-blue-500 rounded-lg px-3 py-2 h-28">
      <Book className="text-gray-500 w-6 h-6 mr-3 mt-1" />
      <textarea
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full h-full resize-none border-none  outline-none"
        required
        placeholder="Titre du cours"
      />
    </div>
  </div>

  {/* Groupes */}
  <div className="md:col-span-1">
    <label className="block text-gray-700 font-medium mb-2">Groupes</label>
    <div className="flex items-start border-2 border border-blue-500 rounded-lg px-3 py-2 h-28">
      <Layers className="text-gray-500 w-6 h-6 mr-3 mt-1" />
      <select
        multiple
        onChange={(e) => setGroupes([...e.target.selectedOptions].map(o => o.value))}
        className="w-full h-full border-none outline-none"
        required
      >
        {groupesDisponibles.map(g => (
          <option key={g.id} value={g.id}>{g.nom_groupe}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Filière */}
  <div>
    <label className="block text-gray-700 font-medium mb-2">Filière</label>
    <div className="flex items-center border border-blue-500 border-2 rounded-lg px-3 py-2">
      <Layers className="text-gray-500 w-6 h-6 mr-3" />
      <select
        value={filiereId}
        onChange={(e) => setFiliereId(e.target.value)}
        className="w-full border-none outline-none"
        required
      >
        <option value="">Sélectionner</option>
        {filieres.map(f => (
          <option key={f.id} value={f.id}>{f.nom}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Matière */}
  <div>
    <label className="block text-gray-700 font-medium mb-2">Matière</label>
    <div className="flex items-center border border-blue-500 border-2 rounded-lg px-3 py-2">
      <Search className="text-gray-500 w-6 h-6 mr-3" />
      <select
        value={matiereId}
        onChange={(e) => setMatiereId(e.target.value)}
        className="w-full border-none outline-none"
        required
      >
        <option value="">Sélectionner</option>
        {matieres.map(m => (
          <option key={m.id} value={m.id}>{m.nom}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Fichier */}
  <div className="md:col-span-2">
    <label className="block text-gray-700 font-medium mb-2">Fichier</label>
    <div className="flex items-center border border-blue-500 border-2 rounded-lg px-3 py-2">
      <FileText className="text-gray-500 w-6 h-6 mr-3" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border-none outline-none"
        required
      />
    </div>
  </div>

  {/* Submit */}
  <div className="md:col-span-2">
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
    >
      Envoyer
    </button>
  </div>

  {/* Lien vers liste des cours */}
  <div className="md:col-span-2">
    <Link
      to="/CoursEnseignant"
      className="flex items-center gap-3 px-4 py-3 text-blue-700 hover:text-white hover:bg-blue-600 transition-colors rounded-lg"
    >
      <FaBookOpen className="text-xl" />
      <span className="text-base font-medium">Voir tous les cours</span>
    </Link>
  </div>
</form>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadCours;
