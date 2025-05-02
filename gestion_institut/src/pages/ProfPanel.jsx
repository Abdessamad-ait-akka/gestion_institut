import React from 'react'
import {useNavigate} from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { MdArrowCircleDown, MdArrowCircleUp, MdArticle  } from 'react-icons/md';

const ProfPanel= () => {
  const navigate = useNavigate();

  return(
    <div style={styles.grid}>
    <DashboardCard
    icon={<MdArrowCircleDown/>}
    title="Devoir"
    description="Voir les devoir des etudiants"
    onClick={() => navigate('/devoirProf')}
    />
    <DashboardCard
    icon={<MdArrowCircleUp/>}
    title="Cours"
    description="Telecharger des cours pour les etudiants"
    onClick={() => navigate('/coursProf')}
    />

    <DashboardCard
    icon={<MdArticle/>}
    title="Notes"
    description= "Noter les etudiants"
    onClick={()=> navigate('/profNotes')}
    />
    </div>
    
  );
};

const styles= {
  grid:{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    justifyItems: 'center',
    padding: '40px',

  },
};

export default ProfPanel;

