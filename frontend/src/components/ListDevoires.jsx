import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Trash, Book, ArrowUpDown, Search, FileText, Eye } from 'lucide-react';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from './Loader';
import { getCurrentUser } from '../api/authService';
import {
  getDevoirsParEnseignant,
  supprimerDevoir,
  telechargerDevoir
} from '../api/devoirService';

const DevoirsList = () => {
  const [devoirs, setDevoirs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Nombre d'éléments par page

  const enseignantId = getCurrentUser()?.id_utilisateur;

  useEffect(() => {
    if (enseignantId) {
      getDevoirsParEnseignant(enseignantId)
        .then(res => setDevoirs(res.data))
        .catch(err => console.error('Erreur chargement devoirs:', err))
        .finally(() => setLoading(false));
    }
  }, [enseignantId]);

  const handleSupprimerDevoir = async (devoirId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce devoir ?')) return;
    try {
      await supprimerDevoir(devoirId);
      setDevoirs(prev => prev.filter(d => d.id !== devoirId));
    } catch (err) {
      console.error('Erreur suppression devoir:', err);
    }
  };

  // Filtrage par recherche
  const devoirsFiltres = devoirs.filter(devoir =>
    devoir.titre.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination : calculer devoirs à afficher
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentDevoirs = devoirsFiltres.slice(indexFirst, indexLast);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(devoirsFiltres.length / itemsPerPage);

  // Fonction pour changer de page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-gray-800">
            <FileText size={28} className="text-blue-800" />
            <span className='text-blue-800'> Mes Devoirs</span>
          </h2>

          {/* Barre de recherche */}
          <div className="mb-4 w-full">
            <div className="flex border rounded shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="flex items-center px-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Rechercher un devoir par titre..."
                className="flex-grow px-2 py-2 outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // reset page à 1 à chaque recherche
                }}
              />
              <button
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center"
                title="Rechercher"
                type="button"
              >
                Rechercher
              </button>
            </div>
          </div>

          {devoirsFiltres.length === 0 ? (
         
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
            <p className="font-semibold">Aucune devoir trouvée</p>
          </div>         
            
          ) : (
            <>
              <div className="space-y-4">
                <div className="hidden md:grid grid-cols-5 font-bold bg-gray-100 p-3 rounded">
                  <div className="flex items-center gap-1">
                    Titre <ArrowUpDown size={16} className="text-gray-500" />
                  </div>
                  <div className="flex items-center gap-1">
                    Description <ArrowUpDown size={16} className="text-gray-500" />
                  </div>
                  <div className="flex items-center gap-1">
                    Date limite <ArrowUpDown size={16} className="text-gray-500" />
                  </div>
                  <div className="flex items-center gap-1">
                    Fichier <ArrowUpDown size={16} className="text-gray-500" />
                  </div>
                  <div className="text-center">Actions</div>
                </div>

                {currentDevoirs.map((devoir) => (
                  <div
                    key={devoir.id}
                    className="bg-white border rounded shadow-sm p-4 grid grid-cols-1 md:grid-cols-5 gap-3"
                  >
                    <div>
                      <span className="md:hidden font-semibold ">Titre :</span>
                      <span className="truncate " title={devoir.titre}>{devoir.titre}</span>
                    </div>
                    <div>
                      <span className="md:hidden font-semibold ">Description :</span>
                      <span className="truncate " title={devoir.description}>{devoir.description}</span>
                    </div>
                    <div>
                      <span className="md:hidden font-semibold ">Date limite :</span>
                      <span>{new Date(devoir.date_limite).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="md:hidden font-semibold ">Fichier :</span>
                      <span className="truncate block" title={devoir.fichier}>{devoir.fichier}</span>
                    </div>
                    <div className="flex justify-start md:justify-center space-x-2">
                      <button
                        onClick={() => telechargerDevoir(devoir.fichier)}
                        className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-700"
                        title="Télécharger"
                      >
                        <Download size={18} />
                      </button>
                      <Link to={`/soumissions/${devoir.id}`}>
                        <button
                          className="bg-green-400 text-white p-2 rounded-full hover:bg-green-700"
                          title="Soumissions"
                        >
                          <Eye size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleSupprimerDevoir(devoir.id)}
                        className="bg-red-400 text-white p-2 rounded-full hover:bg-red-700"
                        title="Supprimer"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? 'cursor-not-allowed text-gray-400 border-gray-300'
                      : 'hover:bg-blue-600 hover:text-white border-blue-600 text-blue-600'
                  }`}
                >
                  Précédent
                </button>

                {/* Boutons de pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'hover:bg-blue-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed text-gray-400 border-gray-300'
                      : 'hover:bg-blue-600 hover:text-white border-blue-600 text-blue-600'
                  }`}
                >
                  Suivant
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DevoirsList;
