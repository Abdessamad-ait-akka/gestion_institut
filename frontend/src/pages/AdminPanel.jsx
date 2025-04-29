import React from 'react';
import { BrowserRouter as Router, Routes, Route,Link} from 'react-router-dom';
import {MdPeople, MdSettings, MdGroups } from 'react-icons/md';

import ManageUsers from './ManageUsers';

const AdminPanel = () =>{
    return(
        <Router>
            <div style={{display: 'felx', minHeight: '100vh', flexDirection: 'column'}}>
                <nav style={styles.navbar}>
                    <Link to="/etudiants" style ={styles.link}><MdPeople /> Etudiants</Link>
                    <Link to="/profs" style ={styles.link}><MdPeople /> Ensaignant</Link>
                </nav>
                <div style={{ flex:1,padding: 20}}>
                    <Routes>
                        <Route pathn="/etudiants" element={<ManageUsers/>} />
                        <Route pathn="/profs" element={<ManageUsers/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
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
  
  export default AdminTabsNavigator;