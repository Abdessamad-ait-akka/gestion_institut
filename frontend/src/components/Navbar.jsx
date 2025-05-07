import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icône utilisateur
import { getCurrentUser } from '../api/authService';

function Navbar() {
  const user = getCurrentUser();



  return (
    <nav className="bg-white shadow-md p-6 flex justify-between items-center">
      <div className="text-xl flex font-semibold text-gray-800"><img src="/public/IMAGES/IBNTOFIAL.png" alt="" width='40' height='60' style={{position:'relative',bottom:12}} className='mr-2' /> Espace Numérique</div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-2xl text-gray-700" />
        <span className="text-gray-700 font-medium">
          {user?.nom || 'Utilisateur'}
        </span>
     
      </div>
    </nav>
  );
}

export default Navbar;
