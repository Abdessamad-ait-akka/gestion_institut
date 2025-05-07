
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EtudiantDashboard from './pages/EtudiantDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';

import PrivateRoute from './auth/ProtectedRoute';
import GroupeManager from './pages/GroupeManager';
import CoursList from './pages/ManageCourses';
import DevoirsList from './pages/ManageDevoires';
import EventList from './pages/Events';
import Sidebar from './components/Sidebar';

function App() {
  return (
    
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route 
          path="/etudiant" 
          element={<PrivateRoute requiredRole="etudiant"><EtudiantDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/enseignant" 
          element={<PrivateRoute requiredRole="enseignant"><EnseignantDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/admin" 
          element={<PrivateRoute requiredRole="administrateur"><AdminDashboard /></PrivateRoute>} 
        />
         <Route 
          path="/manage-users" 
          element={<PrivateRoute requiredRole="administrateur"><ManageUsers /></PrivateRoute>} 
        />
         <Route 
          path="/cours" 
          element={<PrivateRoute requiredRole="administrateur">< CoursList/></PrivateRoute>} 
        />
         <Route 
          path="/devoirs" 
          element={<PrivateRoute requiredRole="administrateur"><DevoirsList /></PrivateRoute>} 
        />
           <Route 
          path="/groupes" 
          element={<PrivateRoute requiredRole="administrateur"><GroupeManager /></PrivateRoute>} 
        />
           <Route 
          path="/events" 
          element={<PrivateRoute requiredRole="administrateur"><EventList /></PrivateRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
