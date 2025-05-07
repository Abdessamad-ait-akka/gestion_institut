import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authService';
import { getDevoirsList, submitDevoir } from '../api/devoirService';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaBook, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

function EtudiantDashboard() {
  const [devoirs, setDevoirs] = useState([]);
  const [fichiers, setFichiers] = useState({});
  const user = getCurrentUser();

  useEffect(() => {
    async function fetchDevoirs() {
      try {
        const response = await getDevoirs();
        const data = Array.isArray(response.data) ? response.data : [];
        setDevoirs(data);
      } catch (err) {
        console.error("Erreur lors du chargement des devoirs :", err);
        setDevoirs([]); // sécurise l'état même en cas d'erreur
      }
    }
  
    fetchDevoirs();
  }, []);
  

  const handleChange = (e, id) => {
    setFichiers({ ...fichiers, [id]: e.target.files[0] });
  };

  const handleSubmit = async (id) => {
    if (!fichiers[id]) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append('fichier', fichiers[id]);

    try {
      await submitDevoir(id, formData);
      alert('Soumission réussie.');
      setFichiers({ ...fichiers, [id]: null });
    } catch (err) {
      alert('Erreur de soumission.');
      console.error('Erreur de soumission:', err);
    }
  };

  return (
    <> 
    <div className="flex ">
      <Sidebar />

      <div className="flex-1 min-h-screen ">
      <Navbar/>
        <h1 className="text-3xl font-bold text-center  mt-8 mb-4 text-gray-800">Bienvenue, {user?.nom || 'Étudiant'}</h1>


<div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-700 mb-4">Navigation rapide</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
    {/* Cours */}
    <Link to="/cours" className="bg-white border border-blue-500 shadow-md hover:shadow-xl text-center transition rounded-xl w-72 h-40 p-4 flex flex-col justify-center items-start space-y-2">
      <FaBook className="text-blue-600  items-center  justify-center items text-7xl m-auto" />
      <span className="text-blue-700  font-medium">Liste des cours</span>
    </Link>

    {/* Devoirs */}
    <Link to="/devoirs" className="bg-white shadow-md border border-blue-500 hover:shadow-xl transition rounded-xl w-72 h-40 p-4 flex flex-col justify-center items-start space-y-2">
      <FaClipboardList className="text-green-600 text-7xl m-auto" />
      <span className="text-green-700 font-medium">Liste des devoirs</span>
    </Link>

    {/* Événements */}
    <Link to="/events" className="bg-white border border-blue-500 shadow-md hover:shadow-xl transition rounded-xl w-72 h-40 p-4 flex flex-col justify-center items-start space-y-2">
      <FaCalendarAlt className="text-pink-600 text-7xl m-auto" />
      <span className="text-pink-700 font-medium">Liste des événements</span>
    </Link>
  </div>
</div>


        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Devoirs à soumettre</h2>
          {devoirs.length > 0 ? (
            <ul className="space-y-6">
              {devoirs.map((devoir) => (
                <li key={devoir.id} className="bg-white shadow p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <strong className="text-lg text-gray-800">{devoir.titre}</strong>
                      <p className="text-sm text-gray-500">Date limite : {devoir.date_limite}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <input
                      type="file"
                      onChange={(e) => handleChange(e, devoir.id)}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    <button
                      onClick={() => handleSubmit(devoir.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Soumettre
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun devoir à soumettre.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default EtudiantDashboard;
