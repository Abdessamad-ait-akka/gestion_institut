import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authService';
import { getDevoirsList, submitDevoir } from '../api/devoirService';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaBook, FaClipboardList, FaCalendarAlt,FaClock ,FaTrashAlt,FaCheckCircle,FaRegCalendarCheck,FaUserGraduate,FaRobot} from 'react-icons/fa';
import { BookOpen } from 'lucide-react';


<FaTrashAlt color="red" />

function EtudiantDashboard() {
  const [devoirs, setDevoirs] = useState([]);
  const [fichiers, setFichiers] = useState({});
  const user = getCurrentUser();

  useEffect(() => {
    async function fetchDevoirs() {
      try {
        const response = await getDevoirsList(); // nom correct de la fonction
        const data = Array.isArray(response.data) ? response.data : [];
        setDevoirs(data);
      } catch (err) {
        console.error("Erreur lors du chargement des devoirs :", err);
        setDevoirs([]);
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
        <h1 className="text-2xl font-bold m-8 mb-4 text-blue-600 flex items-center gap-2">
  <FaUserGraduate className="text-blue-600" />
  Bienvenue, {user?.nom || 'Étudiant'} 
  <span className="text-sm text-gray-500 ml-2 mt-2">(Étudiant)</span>
</h1>
          {/* Navigation rapide */}
          <div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-700 m-8 mb-4">Navigation rapide</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mr-6">
    <Link
      to="/coursEtudiant"
      className="bg-white border border-blue-500 shadow-md hover:shadow-xl text-center transition rounded-xl w-full max-w-sm p-10 flex flex-col justify-center items-start space-y-2"
    >
      <FaBook className="text-blue-600 text-6xl self-center" />
      <span className="text-blue-700 font-medium">Liste des cours</span>
    </Link>

    <Link
      to="/devoirs-et-soumission"
      className="bg-white border border-green-600 shadow-md hover:shadow-xl transition rounded-xl w-full max-w-sm p-10 flex flex-col justify-center items-start space-y-2"
    >
      <FaClipboardList className="text-green-600 text-6xl self-center" />
      <span className="text-green-700 font-medium">Liste des devoirs</span>
    </Link>

    <Link
      to="/events"
      className="bg-white border border-pink-600 shadow-md hover:shadow-xl transition rounded-xl w-full max-w-sm p-10 flex flex-col justify-center items-start space-y-2"
    >
      <FaCalendarAlt className="text-pink-600 text-6xl self-center" />
      <span className="text-pink-700 font-medium">Liste des événements</span>
    </Link>

    <Link
      to="/devoirs-et-soumission"
      className="bg-white border border-blue-600 shadow-md hover:shadow-xl transition rounded-xl w-full max-w-sm p-10 flex flex-col justify-center items-start space-y-2"
    >
      <FaClock className="text-blue-600 text-6xl self-center" />
      <span className="text-blue-700 font-medium">Soumettre un devoir</span>
    
    </Link>

    <Link
      to="/mes-soumissions"
      className="bg-white border border-green-600 shadow-md hover:shadow-xl transition rounded-xl w-full max-w-sm p-10 flex flex-col justify-center items-start space-y-2"
    >
      <FaCheckCircle className="text-green-600 text-6xl self-center" />
      <span className="text-green-700 font-medium">Mes soumessions </span>
    
    </Link>

    <Link
      to="/emploie-de-temps"
      className="bg-white border border-pink-600 shadow-md hover:shadow-xl transition rounded-xl w-full max-w-sm p-10 flex flex-col justify-center items-start space-y-2"
    >
      <FaRegCalendarCheck className="text-pink-600 text-6xl self-center" />
      <span className="text-pink-700 font-medium">Emploie de Temps </span>
    
    </Link>

    <Link
  to="/chat-ai"
  className="bg-white shadow-md hover:shadow-xl border border-indigo-600 transition rounded-xl w-full max-w-sm p-4 flex flex-col justify-center items-start space-y-2"
>
<FaRobot className="text-6xl m-auto text-indigo-600" />
  <h3 className="text-lg font-semibold text-indigo-600">Assistant IA</h3>
  <p className="text-sm text-gray-500">Posez vos questions et obtenez des réponses instantanées.</p>
</Link>
  </div>
</div>



        </main>
      </div>
    </div>
  );
}

export default EtudiantDashboard;
