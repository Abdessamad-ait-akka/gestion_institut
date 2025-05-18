import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { FaBook, FaClipboardList, FaCalendarAlt, FaUpload ,FaClock,FaChalkboardTeacher} from 'react-icons/fa';

import { getCurrentUser } from '../api/authService';
import {
  getDevoirsList,
  downloadDevoir,
  deleteFichierDevoir,
  uploadDevoir
} from '../api/devoirService';
import Loader from '../components/Loader';
const EnseignantDashboard = () => {
  const [devoirs, setDevoirs] = useState([]);
  const [titre, setTitre] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [fichier, setFichier] = useState(null);
  const user = getCurrentUser();

  const fetchDevoirs = async () => {
    try {
      const data = await getDevoirsList();
      setDevoirs(data);
    } catch (error) {
      console.error('Erreur lors du chargement des devoirs:', error.message);
    }
  };

  const handleCreateDevoir = async () => {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('date_limite', dateLimite);
    formData.append('fichier', fichier);

    try {
      await uploadDevoir(formData);
      setTitre('');
      setDateLimite('');
      setFichier(null);
      fetchDevoirs();
    } catch (error) {
      console.error('Erreur lors de l’envoi du devoir:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFichierDevoir(id);
      fetchDevoirs();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.message);
    }
  };

  useEffect(() => {
    fetchDevoirs();
  }, []);

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
      <h1 className="text-2xl font-bold mb-6 mt-4 text-green-600 flex items-center gap-2">
  <FaChalkboardTeacher className="text-green-600 text-2xl" />
  Bienvenue {user?.nom || 'Utilisateur'}
  <span className="text-sm mt-1 text-gray-500 ml-2">(Enseignant)</span>
</h1>

  <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
    <Link
      to="/CoursEnseignant"
      className="bg-white shadow-md hover:shadow-xl transition border border-blue-500 rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
    >
      <FaBook className="text-blue-600 text-6xl m-auto" />
      <h3 className="text-lg font-semibold text-blue-600">Liste des cours</h3>
      <p className="text-sm text-gray-500">Voir tous les cours disponibles</p>
    </Link>

    <Link
      to="/devoirs"
      className="bg-white shadow-md hover:shadow-xl border border-green-600 transition rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
    >
      <FaClipboardList className="text-green-600 text-6xl m-auto" />
      <h3 className="text-lg font-semibold text-green-600">Liste des devoirs</h3>
      <p className="text-sm text-gray-500">Consulter les devoirs à faire</p>
    </Link>

    <Link
      to="/events"
      className="bg-white shadow-md border border-pink-600 hover:shadow-xl transition rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
    >
      <FaCalendarAlt className="text-pink-600 text-6xl m-auto" />
      <h3 className="text-lg font-semibold text-pink-600">Liste des événements</h3>
      <p className="text-sm text-gray-500">Voir le calendrier des événements</p>
    </Link>

    <Link
      to="/upload"
      className="bg-white shadow-md hover:shadow-xl border border-blue-600 transition rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
    >
      <FaUpload className="text-blue-600 text-6xl m-auto" />
      <h3 className="text-lg font-semibold text-blue-600">Envoyer un cours</h3>
      <p className="text-sm text-gray-500">Ajouter un nouveau fichier de cours</p>
    </Link>


    <Link
      to="/CreateDevoirPage"
      className="bg-white shadow-md hover:shadow-xl border border-green-600 transition rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
    >
      <FaClock className="text-green-600 text-6xl m-auto" />
      <h3 className="text-lg font-semibold text-green-600">Envoyer un devoire</h3>
      <p className="text-sm text-gray-500">Ajouter un nouveau fichier de devoire</p>
    </Link>

    <Link
      to="/CreateDevoirPage"
      className="bg-white shadow-md hover:shadow-xl border border-pink-600 transition rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
    >
      <FaClock className="text-pink-600 text-6xl m-auto" />
      <h3 className="text-lg font-semibold text-pink-600">Envoyer un devoire</h3>
      <p className="text-sm text-gray-500">Ajouter un nouveau fichier de devoire</p>
    </Link>
    </div>
</main>

      </div>
    </div>
  );
};

export default EnseignantDashboard;
