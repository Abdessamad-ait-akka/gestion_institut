import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../api/authService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

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
  FaFolderOpen
} from 'react-icons/fa';

function AdminDashboard() {
  const user = getCurrentUser();

  const cards = [
    {
      title: 'Gérer les utilisateurs',
      description: 'Voir tous les utilisateurs et leurs rôles.',
      to: '/manage-users',
      icon: <FaUsers className="text-3xl text-blue-500" />
    },
    {
      title: 'Créer un utilisateur',
      description: 'Ajouter un nouvel utilisateur à la plateforme.',
      to: '/create-user',
      icon: <FaUserPlus className="text-3xl text-blue-500" />
    },
    {
      title: 'Liste des cours',
      description: 'Accéder à tous les cours disponibles.',
      to: '/cours',
      icon: <FaBook className="text-3xl text-green-500" />
    },
    {
      title: 'Gérer les cours',
      description: 'Ajouter, modifier ou supprimer un cours.',
      to: '/manage-courses',
      icon: <FaTasks className="text-3xl text-green-500" />
    },
    {
      title: 'Liste des groupes',
      description: 'Voir tous les groupes d’étudiants.',
      to: '/groupes',
      icon: <FaList className="text-3xl text-yellow-500" />
    },
    {
      title: 'Liste des devoirs',
      description: 'Consulter et gérer les devoirs.',
      to: '/devoirs',
      icon: <FaFolderOpen className="text-3xl text-pink-500" />
    },
    {
      title: 'Liste des événements',
      description: 'Voir les événements à venir.',
      to: '/events',
      icon: <FaCalendarAlt className="text-3xl text-red-500" />
    },
    {
      title: 'Rapport sur les étudiants',
      description: 'Visualiser les performances des étudiants.',
      to: '/reports?type=etudiants',
      icon: <FaUserGraduate className="text-3xl text-purple-500" />
    },
    {
      title: 'Rapport sur les enseignants',
      description: 'Visualiser les performances des enseignants.',
      to: '/reports?type=enseignants',
      icon: <FaChalkboardTeacher className="text-3xl text-purple-500" />
    },
    {
      title: 'Mon profil',
      description: `Nom : ${user.nom}, Email : ${user.email}`,
      to: '/profile',
      icon: <FaUser className="text-3xl text-orange-500" />
    }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            Bienvenue, {user.nom} <span className="text-sm text-gray-500">(Administrateur)</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Link
                key={index}
                to={card.to}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 mb-3">
                  {card.icon}
                  <h2 className="text-xl font-bold text-gray-700">{card.title}</h2>
                </div>
                <p className="text-sm text-gray-600">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
