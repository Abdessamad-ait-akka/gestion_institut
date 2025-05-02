import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { PiStudentBold,  } from 'react-icons/pi';
import {GiTeacher} from 'react-icons/gi';
import {IoIosPeople} from 'react-icons/io';

const AdminPanel= () => {
  const navigate= useNavigate();

  return(
    <div style= {styles.grid}>
      <DashboardCard
      icon={<PiStudentBold/>}
      title="Etudiants"
      decription="Gerer les etudiants"
      onClick ={()=> navigate('/etudiantDashboard')}
      />
      <DashboardCard
      icon={<GiTeacher/>}
      title="Les Profs"
      description="Gerer les Profs"
      onClick={()=> navigate('/profDashboard')}
      />
      <DashboardCard
      icon={<IoIosPeople/>}
      title="Users"
      description="Gerer les utilisateurs"
      onClick = {() => navigate('/users')}
      />
    </div>
  );
};

const styles = {
  grid: {
    dipslay: 'gris',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    justifyItems: 'center',
    padding: '40px',
  },
};

  export default AdminPanel;