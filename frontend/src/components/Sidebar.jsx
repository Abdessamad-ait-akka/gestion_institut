import React, { useState } from 'react';
import {
  FaBars, FaTimes, FaHome, FaUserGraduate,
  FaChalkboardTeacher, FaCalendarAlt, FaUsers, FaBook, FaSignOutAlt
} from 'react-icons/fa';
import { getCurrentUser } from '../api/authService';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const user = getCurrentUser();
  const role = user?.role;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear(); // ou ton service logout()
    navigate('/login');
  };

  const menuItems = [
    { label: 'Accueil', icon: <FaHome />, to: '/' },
    { label: 'Calendrier', icon: <FaCalendarAlt />, to: '/evenements', roles: ['admin', 'enseignant', 'etudiant'] },
    { label: 'Utilisateurs', icon: <FaUsers />, to: '/utilisateurs', roles: ['admin'] },
    { label: 'Cours', icon: <FaBook />, to: '/cours', roles: ['enseignant', 'etudiant'] },
    { label: 'Groupes', icon: <FaUserGraduate />, to: '/groupes', roles: ['admin'] },
    { label: 'Mes Étudiants', icon: <FaChalkboardTeacher />, to: '/cours', roles: ['enseignant'] },
  ];

  return (
    <div className="flex">
    {/* Sidebar */}
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
            .map((item, index) => (
              <Link
                key={index}
                href={item.to}
                className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
        </nav>
      </div>
  
      {/* Logout en bas */}
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
