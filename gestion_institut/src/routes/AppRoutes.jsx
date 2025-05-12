import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import EtudiantPanel from '../pages/EtudiantPanel';
import AdminPanel from '../pages/AdminPanel';
import ProfPanel from '../pages/ProfPanel';
import Messagerie from '../pages/Messagerie';
import Notes from '../pages/Notes';
import Calendrier from '../pages/Calendrier';
import Cours from '../pages/Cours';
import Intervention from '../pages/Intervention';
import Assistance from '../pages/Assistance';
import DevoirProf from '../pages/devoirProf';
import ProfNotes from '../pages/ProfNotes';
import CoursProf from '../pages/coursProf';
import Profdashboard from '../pages/Profdashboard';
import ManageUsers from '../pages/ManageUsers';
import EtudiantDashboard from '../pages/etudiantDashboard';

import EtudiantLayout from '../layouts/EtudiantLayout';
import ProfLayout from '../layouts/ProfLayout';
import AdminLayout from '../Layouts/AdminLayout';

const AppRoutes = ({ userRole }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          userRole === 'admin' ? <Navigate to="/admin" /> :
          userRole === 'prof' ? <Navigate to="/prof" /> :
          userRole === 'etudiant' ? <Navigate to="/etudiant" /> :
          <Navigate to="/login" />
        }
      />

      {/* Étudiant */}
      <Route path="/etudiant" element={<EtudiantLayout><EtudiantPanel /></EtudiantLayout>} />
      <Route path="/notes" element={<EtudiantLayout><Notes /></EtudiantLayout>} />
      <Route path="/calendrier" element={<EtudiantLayout><Calendrier /></EtudiantLayout>} />
      <Route path="/cours" element={<EtudiantLayout><Cours /></EtudiantLayout>} />
      <Route path="/intervention" element={<EtudiantLayout><Intervention /></EtudiantLayout>} />
      <Route path="/assistance" element={<EtudiantLayout><Assistance /></EtudiantLayout>} />
      <Route path="/messagerie" element={<EtudiantLayout><Messagerie /></EtudiantLayout>} />

      {/* Prof */}
      <Route path="/prof" element={<ProfLayout><ProfPanel /></ProfLayout>} />
      <Route path="/profNotes" element={<ProfLayout><ProfNotes /></ProfLayout>} />
      <Route path="/coursprof" element={<ProfLayout><CoursProf /></ProfLayout>} />
      <Route path="/devoirProf" element={<ProfLayout><DevoirProf /></ProfLayout>} />


      {/* Admin */}
      <Route path="/admin" element={<AdminLayout><AdminPanel /></AdminLayout>} />
      <Route path="/users" element={<AdminLayout><ManageUsers /></AdminLayout>} />
      <Route path="/etudiantDashboard" element={<AdminLayout><EtudiantDashboard /></AdminLayout>} />
      <Route path="/profDashboard" element={<AdminLayout><Profdashboard /></AdminLayout>} />        
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
