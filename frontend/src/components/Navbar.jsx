import React from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa'; // Ajout de l'icône de notification
import { getCurrentUser } from '../api/authService';

function Navbar() {
  const user = getCurrentUser();

  return (
    <nav className="bg-white shadow-md p-6 flex justify-between items-center">
      <div className="text-xl flex font-semibold text-gray-800">
        <img
          src="/public/IMAGES/IBNTOFIAL.png"
          alt="Logo"
          width="40"
          height="60"
          style={{ position: 'relative', bottom: 12 }}
          className="mr-2"
        />
        Espace Numérique
      </div>
      
      <div className="flex items-center gap-6">
        {/* Icône de notification */}
        <div className="relative cursor-pointer">
          <FaBell className="text-2xl text-gray-700 hover:text-purple-600 transition duration-200" />
          {/* Badge de notification (optionnel) */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
            3
          </span>
        </div>

        {/* Utilisateur */}
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-700" />
          <span className="text-gray-700 font-medium">
            {user?.nom || 'Utilisateur'}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
