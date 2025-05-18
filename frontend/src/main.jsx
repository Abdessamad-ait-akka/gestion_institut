import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

import FiliereManager from './pages/FiliereManager.jsx'
import GroupeManager from './pages/GroupeManager1.jsx'
import MatiereManager from './pages/MatiereManager.jsx'
import UtilisateurForm from './pages/UtilisateurForm.jsx'
import CoursEtudiant from './components/CoursEtudiant.jsx';
//import Login from './pages/Login.jsx'
//import LoginForm from './pages/LoginForm.jsx'
import SoumettreDevoirForm from './components/SoumettreDevoirForm'
import EmploiForm from './components/EmploiForm'
import EmploiParGroupe from './components/EmploieGroupe.jsx'

import DevoirsEtudiant from './components/CreateDevoirForm.jsx';
import CreateDevoirForm from './components/CreateDevoirForm.jsx';
import DevoirsList from './components/ListDevoires.jsx';
createRoot(document.getElementById('root')).render(
    <App />
)
