import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { MdEmail, MdGrade, MdCalendarMonth, MdBuild, MdComputer, MdHelp} from 'react-icons/md';

const EtudiantPanel= () => {
    const navigate = useNavigate();

    return(
        <div style={StyleSheet.container}>
            <DashboardCard
            icon={<MdEmail />}
            title="Messagerie"
            description="Messagerie electronique des etudiants"
            onClick={() => navigate('/messagerie')}
            />

            <DashboardCard
            icon={<MdGrade />}
            title="Notes"
            description="Consulter vos notes aux epreuves"
            onClick={() =>navigate('/notes')}
            />
            <DashboardCard
            icon={<MdCalendarMonth/>}
            title="Consulter votre calendrier"
            onClick={() => navigate('/calendrier')}
            />
            <DashboardCard
            icon={<MdBuild/>}
            title="Demande d intervention"
            desciption="Assistance aux etudiants"
            onClick={()=>navigate('/intervention')}
            />
            <DashboardCard
            icon={<MdComputer/>}
            title="Cours en ligne"
            description="Acceder a la platforme pedarogique"
            onClick={()=>navigate('/cours')}
            />
            <DashboardCard
            icon={<MdHelp/>}
            title="Assistance ENT"
            description= "FAQ et support ENT"
            onClick={() => navigate('/assistance')}
            />
            
        </div>
    );
};
const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        padding: '40px',
    },
};
export default EtudiantPanel;