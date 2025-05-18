import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSoumissionsParDevoir, telechargerSoumission } from '../api/devoirService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FiDownload, FiSearch } from 'react-icons/fi';
import { FaUserGraduate, FaRegFileAlt, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';

const SoumissionsPage = () => {
  const { devoirId } = useParams();
  const [soumissions, setSoumissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    getSoumissionsParDevoir(devoirId)
      .then(res => setSoumissions(res.data))
      .catch(err => console.error('Erreur chargement soumissions:', err))
      .finally(() => setLoading(false));
  }, [devoirId]);

  // Filtre par nom, groupe, fichier, mais aussi par ID et date locale
  const soumissionsFiltrees = soumissions.filter(s => {
    const term = searchTerm.toLowerCase().trim();
    const dateStr = new Date(s.date_soumission)
      .toLocaleDateString()
      .toLowerCase();
    return (
      s.id.toString().includes(term) ||
      (s.nom?.toLowerCase().includes(term)) ||
      (s.nom_groupe?.toLowerCase().includes(term)) ||
      (s.fichier?.toLowerCase().includes(term)) ||
      dateStr.includes(term)
    );
  });

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSoumissions = soumissionsFiltrees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(soumissionsFiltrees.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
      {/* Sidebar fixée à gauche */}
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Navbar sticky */}
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-blue-800 flex items-center gap-2">
              <FaRegFileAlt className="text-blue-800 text-2xl" />
              Soumissions du devoir #{devoirId}
            </h2>

            <div className="relative w-72">
              <input
                type="text"
                placeholder="Recherche par ID, date, nom..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>

          {soumissionsFiltrees.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
  <p className="font-semibold">Aucune soumission trouvée</p>
  <p className="text-sm">Il n'y a actuellement aucune soumission à afficher pour ce devoir.</p>
</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        <FaUserGraduate className="inline mr-1" />Étudiant
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Groupe</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        <FaCalendarAlt className="inline mr-1" />Date
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fichier</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Note</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        <FaCommentDots className="inline mr-1" />Commentaire
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSoumissions.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="px-4 py-2 text-sm text-gray-800">{s.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {s.nom || `Étudiant #${s.etudiant_id}`}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">{s.nom_groupe || '—'}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {new Date(s.date_soumission).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800 truncate max-w-xs" title={s.fichier}>
                          {s.fichier}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">{s.note ?? '—'}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{s.commentaire || '—'}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => telechargerSoumission(s.fichier)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full text-sm"
                            title="Télécharger la soumission"
                          >
                            <FiDownload />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Précédent
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
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

export default SoumissionsPage;
