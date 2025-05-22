import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/authService';
import { userApi } from '../api/userapi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import {
  FaUsers,
  FaUserPlus,
  FaBook,
  FaList,
  FaTasks,
  FaCalendarAlt,
  FaChartBar,
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaFolderOpen,
  FaBookOpen,
  FaUserShield,
  FaSignOutAlt,FaRegCalendarCheck,FaRobot
} from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ etudiants: 0, enseignants: 0, administrateurs: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await userApi.getUserCounts();
        setCounts(data);
      } catch (err) {
        console.error('Erreur récupération counts:', err);
      }
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  if (loading || !user) {
    return <Loader />;
  }

  const cards = [
    {
      title: 'Gérer les utilisateurs',
      description: 'Voir tous les utilisateurs et leurs rôles.',
      to: '/manage-users',
      icon: <FaUsers className="text-3xl text-blue-500" />
    },
    {
      title: 'Gérer les cours',
      description: 'Accéder à tous les cours disponibles.',
      to: '/coursAdmin',
      icon: <FaBook className="text-3xl text-green-500" />
    },
    {
      title: 'Liste des devoirs',
      description: 'Consulter et gérer les devoirs.',
      to: '/devoirs',
      icon: <FaFolderOpen className="text-3xl text-pink-500" />
    },
    {
      title: 'Gérer les filières',
      description: 'Ajouter, modifier ou supprimer une filière.',
      to: '/filiere',
      icon: <FaTasks className="text-3xl text-green-500" />
    },
    {
      title: 'Gérer les groupes',
      description: 'Voir tous les groupes d’étudiants.',
      to: '/groupes',
      icon: <FaList className="text-3xl text-yellow-500" />
    },
    {
      title: 'Gérer les matières',
      description: 'Gestion des matières pour chaque filière.',
      to: '/matiere',
      icon: <FaBookOpen className="text-3xl text-purple-500" />
    },
    {
      title: 'Gérer des événements',
      description: 'Voir les événements à venir.',
      to: '/events',
      icon: <FaCalendarAlt className="text-3xl text-red-500" />
    },
    {
      title: 'Gérer les emplois du temps',
      description: 'Créer, modifier et visualiser les emplois du temps des groupes et enseignants.',
      to: '/gestion-emploie-de-temps',
      icon: <FaRegCalendarCheck className="text-3xl text-purple-500" />
    },
    
    {
      title: 'Mon profil',
      description: `Nom : ${user.nom}, Email : ${user.email}`,
      to: '/profile',
      icon: <FaUser className="text-3xl text-orange-500" />
    },
    {
      title: 'Assistant IA',
      description: 'Posez vos questions et obtenez des réponses instantanées.',
      to: '/chat-ai',
      icon: <FaRobot className="text-3xl text-indigo-600" />
    }
    
  ];

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
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-red-400 flex items-center gap-2">
  <FaUserShield className="text-red-400 text-2xl" />
  Bienvenue, {user.nom}
  <span className="text-sm text-gray-500 ml-2">(Administrateur)</span>
</h1>
           
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 h-60 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold">Étudiants</h3>
      <p className="text-2xl font-bold">{counts.etudiants}</p>
    </div>
    <FaUserGraduate className="text-7xl opacity-80" />
  </div>

  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 h-60 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold">Enseignants</h3>
      <p className="text-2xl font-bold">{counts.enseignants}</p>
    </div>
    <FaChalkboardTeacher className="text-8xl opacity-80 " />
  </div>

  <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 h-60 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold">Administrateurs</h3>
      <p className="text-2xl font-bold">{counts.administrateurs}</p>
    </div>
    <FaUserShield className="text-8xl opacity-80" />
  </div>
</div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {cards.map((card, index) => (
              <Link
                key={index}
                to={card.to}
                className="bg-white rounded-2xl shadow-md border border-blue-500 p-5 hover:shadow-lg transition hover:bg-gray-50 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    {card.icon}
                    <h2 className="text-xl font-bold text-gray-700">{card.title}</h2>
                  </div>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
