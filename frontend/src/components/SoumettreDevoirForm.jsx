import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authService';
import {
  getDevoirsActifsParGroupe,
  soumettreDevoir,
  getLienTelechargement
} from '../api/devoirService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FiUpload, FiFileText, FiClock, FiDownload, FiAlertCircle, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SoumettreDevoirForm = ({ devoirId }) => {
  const [fichier, setFichier] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const etudiantId = getCurrentUser()?.id_utilisateur;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fichier) {
      setMessage('Veuillez sélectionner un fichier.');
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append('devoir_id', devoirId);
    formData.append('etudiant_id', etudiantId);
    formData.append('fichier', fichier);
    formData.append('commentaire', commentaire);

    try {
      await soumettreDevoir(formData);
      setMessage('✅ Soumission réussie');
      setFichier(null);
      setCommentaire('');
    } catch {
      setMessage('❌ Échec de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow space-y-4 max-w-xl mx-auto">
      <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
        <FiUpload /> Soumettre ma copie
      </h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fichier <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={e => setFichier(e.target.files[0])}
          className="block w-full text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire (optionnel)</label>
        <textarea
          rows={3}
          value={commentaire}
          onChange={e => setCommentaire(e.target.value)}
          className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Votre commentaire..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-white ${
          submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {submitting ? 'En cours...' : 'Soumettre'}
      </button>

      {message && <p className="text-center text-sm text-gray-600">{message}</p>}
    </form>
  );
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages === 1) return null;

  // Crée un tableau des numéros de pages à afficher (ex : 1 2 3 4 5)
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-6" aria-label="Pagination navigation">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="p-2 rounded-md bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
      >
        <FiChevronLeft />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`px-3 py-1 rounded-md font-medium ${
            page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="p-2 rounded-md bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
      >
        <FiChevronRight />
      </button>
    </nav>
  );
};

const DevoirsEtSoumission = () => {
  const [devoirs, setDevoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = getCurrentUser();
  const groupeId = currentUser?.groupe;
  const itemsPerPage = 20;

  useEffect(() => {
    if (!groupeId) return setLoading(false);
    setLoading(true);
    getDevoirsActifsParGroupe(groupeId)
      .then(setDevoirs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [groupeId]);

  const isBeforeDeadline = (dateLimite) => new Date(dateLimite) > new Date();

  // Filtrer selon terme recherche
  const filteredDevoirs = devoirs.filter(
    devoir =>
      devoir.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devoir.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination - calculer devoirs à afficher
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDevoirs = filteredDevoirs.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // reset pagination au nouveau filtre
  };

  const handlePageChange = (page) => {
    if (page < 1) return;
    const totalPages = Math.ceil(filteredDevoirs.length / itemsPerPage);
    if (page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // remonter en haut à chaque changement de page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-blue-800 flex items-center gap-2 mb-6">
            <FiFileText className="text-blue-800 text-2xl" />
            Mes devoirs à rendre
          </h2>

          <form
            onSubmit={handleSearchSubmit}
            className="mb-6  flex"
            role="search"
            aria-label="Recherche de devoirs"
          >
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Rechercher un devoir..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full rounded-l-md border border-r-0 border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md font-semibold"
              aria-label="Rechercher"
            >
              Rechercher
            </button>
          </form>

          {filteredDevoirs.length === 0 ? (
            <p className="text-gray-600 text-center">Aucun devoir actif pour votre groupe.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentDevoirs.map(devoir => (
                  <div
                    key={devoir.id}
                    className="bg-white rounded-md shadow p-6 border border-gray-200 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                        <FiFileText /> {devoir.titre}
                      </h3>
                      <p className="text-gray-600">
                        <span className="font-semibold">Description:</span> {devoir.description}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <FiClock /> <span className="font-semibold">Date limite:</span>{' '}
                        {new Date(devoir.date_limite).toLocaleString()}
                      </p>
                      <a
                        href={getLienTelechargement(devoir.fichier)}
                        download
                        className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline"
                      >
                        <FiDownload /> Télécharger le document
                      </a>
                    </div>

                    <div className="mt-4">
                      {isBeforeDeadline(devoir.date_limite) ? (
                        <SoumettreDevoirForm devoirId={devoir.id} />
                      ) : (
                        <p className="text-red-500 font-semibold flex items-center gap-1">
                          <FiAlertCircle /> Date limite dépassée
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                totalItems={filteredDevoirs.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DevoirsEtSoumission;
