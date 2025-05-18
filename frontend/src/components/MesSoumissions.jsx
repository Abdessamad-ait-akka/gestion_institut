import React, { useEffect, useState, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { getCurrentUser } from '../api/authService';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const BASE_URL = 'http://localhost:5003/api/devoirs';

// Icônes SVG
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
  </svg>
);
const DownloadIcon = () => (
  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
    <path d="M19 19H5" />
  </svg>
);
const DeleteIcon = () => (
  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

function MesSoumissions() {
  const [soumissions, setSoumissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingIds, setDeletingIds] = useState([]);

  const itemsPerPage = 6;
  const etudiantId = getCurrentUser()?.id_utilisateur;

  useEffect(() => {
    if (!etudiantId) {
      toast.error('Utilisateur non connecté');
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/mes_soumissions?etudiant_id=${etudiantId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des soumissions');
        return res.json();
      })
      .then(data => setSoumissions(data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [etudiantId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette soumission ?')) return;
    setDeletingIds(prev => [...prev, id]);
    try {
      const res = await fetch(`${BASE_URL}/soumissions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setSoumissions(prev => prev.filter(s => s.id !== id));
      toast.success('Soumission supprimée avec succès');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingIds(prev => prev.filter(delId => delId !== id));
    }
  };

  const filteredSoumissions = useMemo(() =>
    soumissions.filter(s => {
      const name = s.fichier.split('/').pop().toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || s.devoir_id.toString().includes(searchTerm);
    }), [searchTerm, soumissions]
  );

  const totalPages = Math.ceil(filteredSoumissions.length / itemsPerPage);
  const paginated = filteredSoumissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>
        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Mes soumissions de devoirs</h2>
          <form onSubmit={e => { e.preventDefault(); setCurrentPage(1); }} className="mb-6 w-full flex border border-blue-500 rounded">
            <input
              type="text"
              placeholder="Rechercher par fichier ou devoir ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center justify-center">
              <SearchIcon className="text-white "/>
            </button>
          </form>

          {paginated.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(s => {
                const filename = s.fichier.split('/').pop();
                const deleting = deletingIds.includes(s.id);
                return (
                  <div key={s.id} className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg flex flex-col justify-between">
                    <div>
                      <p><strong>Devoir ID:</strong> {s.devoir_id}</p>
                      <p>
                        <strong>Fichier:</strong>{' '}
                        <a
                          href={`${BASE_URL}/telecharger/soumission/${filename}`}
                          className="text-blue-600 underline break-words"
                          target="_blank"
                          rel="noopener noreferrer"
                        >{filename}</a>
                      </p>
                      <p><strong>Date:</strong> {new Date(s.date_soumission).toLocaleString()}</p>
                      <p><strong>Note:</strong> {s.note ?? 'Non noté'}</p>
                      <p><strong>Commentaire:</strong> {s.commentaire || '-'}</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <a
                        href={`${BASE_URL}/telecharger/soumission/${filename}`}
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        title="Télécharger"
                      ><DownloadIcon />Télécharger</a>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting}
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
                        title="Supprimer"
                      >
                        <DeleteIcon />{deleting ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
            <p className="font-semibold">Aucune soumission trouvée</p>
            <p className="text-sm">Il n'y a actuellement aucune soumission à afficher pour ce devoir.</p>
          </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-3">
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MesSoumissions;
