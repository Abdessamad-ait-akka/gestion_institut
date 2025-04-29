import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EtudiantDashboard from './etudiantDashboard';
import ManageUsers from './ManageUsers';
import ProfDashboard from './Profdashboard';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const DashboardNav = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 40 }}>
      <button style={styles.button} onClick={() => navigate('/etudiants')}>Etudiant Dashboard</button>
      <button style={styles.button} onClick={() => navigate('/enseignant')}>Enseignant Dashboard</button>
      <button style={styles.button} onClick={() => navigate('/manageUsers')}>Manage Users</button>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <>
      <DashboardNav />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/etudiants" element={<EtudiantDashboard />} />
          <Route path="/enseignant" element={<ProfDashboard />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
        </Routes>
      </div>
    </>
  );
};

const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-around',
      background: '#f0f0f0',
      padding: '12px 0',
      borderBottom: '1px solid #ddd',
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
  };
  
  export default AdminPanel;