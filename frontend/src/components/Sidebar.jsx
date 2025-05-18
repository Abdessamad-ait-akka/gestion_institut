import React, { useState } from 'react';
import {
  FaBars, FaTimes, FaHome, FaUserGraduate,
  FaChalkboardTeacher, FaCalendarAlt, FaUsers, FaBook, FaSignOutAlt,
  FaClipboardList, FaList, FaUser, FaBookOpen, FaTasks,FaClock,FaUpload,FaRegCalendarCheck
} from 'react-icons/fa';
import { getCurrentUser } from '../api/authService';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const user = getCurrentUser();
  const role = user?.role;
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };
  
  const handleLinkClick = () => {
    // Fermer le menu si réduit
    if (!isOpen) return;
    setIsOpen(true);
  };

  const menuItems = [
    { label: 'Accueil', icon: <FaHome />, to: '/enseignant', roles: ['enseignant'] },
    { label: 'Accueil', icon: <FaHome />, to: '/etudiant', roles: ['etudiant'] },
    { label: 'Accueil', icon: <FaHome />, to: '/admin', roles: ['administrateur'] },

    { label: 'Envoiyer un Devoir', icon: <FaClock />, to: '/CreateDevoirPage', roles: ['enseignant'] },
    { label: 'Envoiyer un cour', icon: <FaUpload />, to: '/upload', roles: ['enseignant'] },

    
    { label: 'devoirs-et-soumission', icon: <FaClock />, to: '/devoirs-et-soumission', roles: ['etudiant'] },

    { label: 'Liste des devoirs', icon: <FaClipboardList />, to: '/mes-soumissions', roles: ['etudiant', 'administrateur', 'enseignant'] },
    { label: 'Evenements', icon: <FaCalendarAlt />, to: '/events', roles: ['administrateur', 'enseignant', 'etudiant'] },

    { label: 'Utilisateurs', icon: <FaUsers />, to: '/manage-users', roles: ['administrateur'] },
    { label: 'Filières', icon: <FaTasks />, to: '/filiere', roles: ['administrateur'] },
    { label: 'Groupes', icon: <FaList />, to: '/groupes', roles: ['administrateur'] },
    { label: 'Matières', icon: <FaBookOpen />, to: '/matiere', roles: ['administrateur'] },
    { label: 'Gérer les Cours', icon: <FaBook />, to: '/coursAdmin', roles: ['administrateur'] },
    { label: 'Gérer es emplois ', icon: <FaRegCalendarCheck />, to: '/gestion-emploie-de-temps', roles: ['administrateur'] },
    { label: 'Profil', icon: <FaUser />, to: '/profile', roles: ['administrateur'] },

    { label: 'Liste des cours', icon: <FaBook />, to: '/coursEtudiant', roles: ['etudiant'] },
    { label: 'Liste des cours', icon: <FaBook />, to: '/CoursEnseignant', roles: ['enseignant'] },
    { label: 'Mes Étudiants', icon: <FaChalkboardTeacher />, to: '/cours', roles: ['enseignant'] },
  ];

  return (
    <div className="flex">
      <div className={`bg-gray-800 text-white min-h-screen flex flex-col justify-between transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} shadow-lg border border-blue-500`}>

        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            {isOpen && <span className="text-lg font-bold">ENT</span>}
            <button onClick={toggleSidebar}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Menu */}
          <nav className="mt-4">
            {menuItems
              .filter(item => !item.roles || item.roles.includes(role))
              .map((item, index) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={handleLinkClick}
                    className={`flex items-center px-4 py-3 transition-colors
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold'
                        : 'hover:bg-gray-700'}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isOpen && <span className="ml-3">{item.label}</span>}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Logout */}
        <div className="mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            {isOpen && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
