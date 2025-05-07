import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaBook, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';
import { getCurrentUser } from '../api/authService';

import { getDevoirsList, downloadDevoir,deleteFichierDevoir,uploadDevoir} from '../api/devoirService';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const App = () => {
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
      console.error(error.message);
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
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFichierDevoir(id);
      fetchDevoirs();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchDevoirs();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ">
      <Navbar/>

        <h1 className="text-3xl font-bold mb-6 text-center mt-10">Bineveue  {user?.nom || 'Utilisateur'} </h1>

     

        <div className="mb-8 grid grid-cols-1 ml-5 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
  <Link
    to="/cours"
    className="bg-white shadow-md hover:shadow-xl transition border border-blue-500 rounded-xl w-72 h-40 p-4 flex flex-col justify-center items-start space-y-2"
  >
    <FaBook className="text-blue-600  text-7xl m-auto" />
    <h3 className="text-lg text-blue-600 font-semibold text-gray-800">Liste des cours</h3>
    <p className="text-sm text-gray-500">Voir tous les cours disponibles</p>
  </Link>

  {/* Devoirs Card */}
  <Link
    to="/devoirs"
    className="bg-white shadow-md hover:shadow-xl border border-blue-500 transition rounded-xl w-72 h-40 p-4 flex flex-col justify-center items-start space-y-2"
  >
    <FaClipboardList className="text-green-600  text-7xl m-auto" />
    <h3 className="text-lg font-semibold text-green-600 text-gray-800">Liste des devoirs</h3>
    <p className="text-sm text-gray-500">Consulter les devoirs à faire</p>
  </Link>

  <Link
    to="/events"
    className="bg-white shadow-md border border-blue-500 hover:shadow-xl transition rounded-xl w-72 h-40 p-4 flex flex-col justify-center items-start space-y-2"
  >
    <FaCalendarAlt className="text-pink-600  text-7xl m-auto" />
    <h3 className="text-lg font-semibold text-pink-600 text-gray-800">Liste des événements</h3>
    <p className="text-sm text-gray-500">Voir le calendrier des événements</p>
  </Link>
</div>

       
      </div>
    </div>
  );
};

export default App;
