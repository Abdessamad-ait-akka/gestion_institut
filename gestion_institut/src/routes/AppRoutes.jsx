import React from 'react';
import { Routes , Route, Navigate} from 'react-router-dom';

import Login from '../pages/Login';
import EtudiantPanel from '../pages/EtudiantPanel';
import AdminPanel from '../pages/AdminPanel';
import ProfPanel from '../pages/ProfPanel';
import Messagerie from '../pages/Messagerie.jsx';

import Notes from '../pages/Notes';
import Calendrier from '../pages/Notes';
import Cours from '../pages/cours';
import Intervention from '../pages/Intervention';
import Assistance from '../pages/Assistance';

const AppRoutes = ({ userRole }) => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
                        
            <Route path="/" element={
                userRole === 'admin' ? <Navigate to="/adminPanel"/>:
                userRole === 'prof' ? <NAvigate to = "/prof"/>:
                userRole === 'etudiant' ? <Navigate to="/etudiant"/>:
                <Navigate to="/login"/>
            } />


            <Route path="/etudiant" element={<EtudiantPanel/>} />
            <Route path="/notes" element ={<Notes/>}/>
            <Route path="/calendrier" element ={<Calendrier/>} />
            <Route path= "/cours" element ={<Cours/>}/>
            <Route path = "/intervention" element ={<Intervention/>}/>
            <Route path = "/assistance " element ={<Assistance />}/>
            <Route path ="/messagerie" element ={<Messagerie/>} />


            <Route path="*" element={<Navigate to ="/" />}/>

        </Routes>
    );
};

export default AppRoutes;