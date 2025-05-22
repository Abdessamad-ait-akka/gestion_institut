
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EtudiantDashboard from './pages/EtudiantDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import AdminDashboard from './pages/AdminDashboard';
//import ManageUsers from './pages/ManageUsers';

import PrivateRoute from './auth/ProtectedRoute';
//import GroupeManager from './pages/GroupeManager';
import EventManager from './pages/Events';
import Sidebar from './components/Sidebar';
//import LoginForm from './pages/LoginForm';
import UtilisateurForm from './pages/UtilisateurForm';
import FiliereManager from './pages/FiliereManager';
import MatiereManager from './pages/MatiereManager';
import GroupeManager from './pages/GroupeManager1';
import UploadCours from './components/UploadeCours';
import CoursEtudiant from './components/CoursEtudiant';
import AllCourses from './components/CoursAdmin';
import CoursEnseignant from './components/CourseEnseingnant';
import CreateDevoirPage from './components/CreateDevoirForm';
import SoumissionsPage from './components/ListSoumission';
import DevoirsList from './components/ListDevoires';
import DevoirsEtSoumission from './components/SoumettreDevoirForm';
import MesSoumissions from './components/MesSoumissions';
import EmploiCRUD from './components/EmploiForm';
import EmploiParGroupe from './components/EmploieGroupe';
import ChatAI from './pages/ChatBot';


function App() {
  return (
    
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />
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
          element={<PrivateRoute requiredRole="administrateur"><UtilisateurForm /></PrivateRoute>} 
        />
      
         <Route 
          path="/devoirs" 
          element={<PrivateRoute requiredRole="enseignant"><DevoirsList /></PrivateRoute>} 
        />
           <Route 
          path="/groupes" 
          element={<PrivateRoute requiredRole="administrateur"><GroupeManager /></PrivateRoute>} 
        />
        <Route 
          path="/filiere" 
          element={<PrivateRoute requiredRole="administrateur"><FiliereManager /></PrivateRoute>} 
        />
         <Route 
          path="/matiere" 
          element={<PrivateRoute requiredRole="administrateur"><MatiereManager /></PrivateRoute>} 
        />
         <Route 
          path="/upload" 
          element={<PrivateRoute requiredRole="enseignant"><UploadCours /></PrivateRoute>} 
        />
       
           <Route 
          path="/coursEtudiant" 
          element={<PrivateRoute requiredRole="administrateur"><CoursEtudiant /></PrivateRoute>} 
        />
          <Route 
          path="/coursAdmin" 
          element={<PrivateRoute requiredRole="administrateur"><AllCourses /></PrivateRoute>} 
        />
          <Route 
          path="/CoursEnseignant" 
          element={<PrivateRoute requiredRole="enseignant"><CoursEnseignant /></PrivateRoute>} 
        />
          <Route 
          path="/CreateDevoirPage" 
          element={<PrivateRoute requiredRole="enseignant"><CreateDevoirPage /></PrivateRoute>} 
        />
          <Route 
          path="/DevoirsList" 
          element={<PrivateRoute requiredRole="enseignant"><DevoirsList /></PrivateRoute>} 
        />  <Route 
        path="/soumissions/:devoirId" 
        element={<PrivateRoute requiredRole="enseignant"><SoumissionsPage /></PrivateRoute>} 
      />
        <Route 
          path="/Chat-ai" 
          element={<PrivateRoute requiredRole="enseignant"><ChatAI /></PrivateRoute>} 
        /> 
       <Route 
        path="/mes-soumissions" 
        element={<PrivateRoute requiredRole="administrateur"><MesSoumissions /></PrivateRoute>} 
      />
       
       
       <Route
        path="/devoirs-et-soumission"
        element={<PrivateRoute requiredRole="administrateur">
            <DevoirsEtSoumission />
            </PrivateRoute>
        }
      />

<Route 
        path="/gestion-emploie-de-temps" 
        element={<PrivateRoute requiredRole="administrateur"><EmploiCRUD /></PrivateRoute>} 
      />
        <Route 
        path="/emploie-de-temps" 
        element={<PrivateRoute requiredRole="administrateur"><EmploiParGroupe /></PrivateRoute>} 
      />
           <Route 
          path="/events" 
          element={<PrivateRoute requiredRole="administrateur"><EventManager /></PrivateRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
