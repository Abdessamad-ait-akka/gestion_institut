import React, { useEffect, useState } from 'react';
import {
  getDevoirsList,
  downloadDevoir,
  deleteFichierDevoir,
  uploadDevoir,
  submitDevoir,
  getDevoirsRendus,
  attribuerNote
} from '../api/devoirService';
import { getUserRole } from '../api/authService';
import { FaDownload, FaTrash, FaUpload, FaPlus, FaClipboardCheck,FaClipboardList } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ITEMS_PER_PAGE = 6;

const DevoirsList = () => {
  const [devoirsList, setDevoirsList] = useState([]);
  const [devoirsRendus, setDevoirsRendus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [devoirTitre, setDevoirTitre] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [devoirFichier, setDevoirFichier] = useState(null);
  const [soumissions, setSoumissions] = useState({});
  const [notes, setNotes] = useState({});
  const [pageAFaire, setPageAFaire] = useState(1);
  const [pageRendus, setPageRendus] = useState(1);

  useEffect(() => {
    setUserRole(getUserRole());
    fetchDevoirs();
    fetchDevoirsRendus();
  }, []);

  const fetchDevoirs = async () => {
    try {
      const data = await getDevoirsList();
      setDevoirsList(data);
    } catch (err) {
      console.error('Erreur récupération devoirs', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevoirsRendus = async () => {
    try {
      const data = await getDevoirsRendus();
      setDevoirsRendus(data);
    } catch (err) {
      console.error('Erreur récupération devoirs rendus', err);
    }
  };

  const handleDevoirSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', devoirTitre);
    formData.append('date_limite', dateLimite);
    formData.append('fichier', devoirFichier);
    formData.append('enseignant_id', localStorage.getItem('user_id'));
    try {
      await uploadDevoir(formData);
      setDevoirTitre('');
      setDateLimite('');
      setDevoirFichier(null);
      fetchDevoirs();
    } catch (err) {
      alert("Erreur ajout devoir");
    }
  };

  const handleSoumission = async (e, devoirId) => {
    e.preventDefault();
    const fichier = soumissions[devoirId];
    if (!fichier) return;
    const formData = new FormData();
    formData.append('fichier', fichier);
    formData.append('etudiant_id', localStorage.getItem('user_id'));
    try {
      await submitDevoir(devoirId, formData);
      fetchDevoirs();
    } catch (err) {
      alert("Erreur soumission");
    }
  };

  const handleAttribuerNote = async (devoirId) => {
    const note = notes[devoirId];
    if (!note) return;
    try {
      await attribuerNote(devoirId, note);
      alert("Note attribuée !");
      fetchDevoirsRendus();
    } catch (err) {
      alert("Erreur attribution note");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce devoir ?")) {
      await deleteFichierDevoir(id);
      fetchDevoirs();
    }
  };

  const isBeforeDeadline = (dateLimite) => new Date() <= new Date(dateLimite);
  const devoirsAFaire = devoirsList.filter(d => !d.etudiant_id);

  // Pagination
  const paginatedAFaire = devoirsAFaire.slice((pageAFaire - 1) * ITEMS_PER_PAGE, pageAFaire * ITEMS_PER_PAGE);
  const paginatedRendus = devoirsRendus.slice((pageRendus - 1) * ITEMS_PER_PAGE, pageRendus * ITEMS_PER_PAGE);

  return (
    <>
      
      <div className="flex">
        <Sidebar />
        <div className="flex-1 "> 
        <Navbar />{/* Adjust margins for fixed sidebar/navbar */}
        <h1 className="text-2xl font-bold mb-6  text-blue-600 mt-10 flex  m-5 gap-3">
  <FaClipboardList className="text-blue-600" />
  Gestion des Devoirs
</h1>
          {userRole === 'enseignant' && (
            <form onSubmit={handleDevoirSubmit}  className="bg-white border border-blue-500 shadow-md rounded p-6 m-5 mb-6 max-w-xl " >
              <h2 className="text-xl font-semibold mb-4 flex items-center"><FaPlus className="mr-2" /> Ajouter un Devoir</h2>
              <input className="w-full mb-2 border p-2 rounded" type="text" value={devoirTitre} onChange={e => setDevoirTitre(e.target.value)} placeholder="Titre" required />
              <input className="w-full mb-2 border p-2 rounded" type="datetime-local" value={dateLimite} onChange={e => setDateLimite(e.target.value)} required />
              <input className="w-full mb-2" type="file" onChange={e => setDevoirFichier(e.target.files[0])} required />
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center" type="submit">
                <FaUpload className="mr-2" /> Envoyer
              </button>
            </form>
          )}

          <h2 className="text-2xl font-semibold my-4">📚 Devoirs à faire</h2>
          {loading ? <p>Chargement...</p> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedAFaire.map(devoir => (
                  <div key={devoir.id} className="bg-white shadow-lg rounded-lg p-4">
                    <img src="/public/IMAGES/image.png" alt="task" className="w-16 h-16 mx-auto mb-3" />
                    <h3 className="text-lg font-bold">{devoir.titre}</h3>
                    <p className="text-sm mb-2">📅 Limite : {new Date(devoir.date_limite).toLocaleString()}</p>
                    {devoir.fichier && (
                      <button onClick={() => downloadDevoir(devoir.fichier)} className="bg-green-500 text-white px-2 py-1 rounded mr-2 flex items-center">
                        <FaDownload className="mr-1" /> Télécharger
                      </button>
                    )}
                    {userRole === 'etudiant' && isBeforeDeadline(devoir.date_limite) && (
                      <form onSubmit={(e) => handleSoumission(e, devoir.id)} className="mt-2">
                        <input className="mb-2" type="file" onChange={e => setSoumissions({ ...soumissions, [devoir.id]: e.target.files[0] })} required />
                        <button className="bg-blue-500 text-white px-2 py-1 rounded flex items-center" type="submit">
                          <FaUpload className="mr-1" /> Soumettre
                        </button>
                      </form>
                    )}
                    {(userRole === 'enseignant' || userRole === 'administrateur') && (
                      <button onClick={() => handleDelete(devoir.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2 flex items-center">
                        <FaTrash className="mr-1" /> Supprimer
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.ceil(devoirsAFaire.length / ITEMS_PER_PAGE) }, (_, i) => (
                  <button key={i} onClick={() => setPageAFaire(i + 1)}
                    className={`px-3 py-1 rounded ${pageAFaire === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}

          <h2 className="text-2xl font-semibold mt-8 mb-4">📨 Devoirs rendus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRendus.map(devoir => (
              <div key={devoir.id} className="bg-gray-100 shadow rounded p-4">
                <h3 className="font-bold text-lg">{devoir.titre}</h3>
                <p className="text-sm mb-2">🧑 Étudiant ID : {devoir.etudiant_id}</p>
                {devoir.fichier && (
                  <button onClick={() => downloadDevoir(devoir.fichier)} className="bg-green-500 text-white px-2 py-1 rounded flex items-center">
                    <FaDownload className="mr-1" /> Télécharger rendu
                  </button>
                )}
                {userRole === 'enseignant' && (
                  <div className="mt-2">
                    <input type="number" className="border p-1 rounded w-20 mr-2" placeholder="Note"
                      onChange={e => setNotes({ ...notes, [devoir.id]: e.target.value })} />
                    <button onClick={() => handleAttribuerNote(devoir.id)} className="bg-indigo-500 text-white px-2 py-1 rounded flex items-center">
                      <FaClipboardCheck className="mr-1" /> Noter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(devoirsRendus.length / ITEMS_PER_PAGE) }, (_, i) => (
              <button key={i} onClick={() => setPageRendus(i + 1)}
                className={`px-3 py-1 rounded ${pageRendus === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DevoirsList;
