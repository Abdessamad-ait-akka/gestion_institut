import React, { useEffect, useState } from 'react';
import { Download, Trash, Book, Search } from 'lucide-react';
import { getCurrentUser } from '../api/authService';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from './Loader';
import { getCoursByEnseignant, deleteCours, downloadCoursFile } from '../api/courseService';

const CoursEnseignant = () => {
  const [cours, setCours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [enseignantId, setEnseignantId] = useState(null);
  const [loadingCours, setLoadingCours] = useState(true);
  const itemsPerPage = 20;

  const fetchCours = async () => {
    if (enseignantId) {
      try {
        setLoadingCours(true);
        const data = await getCoursByEnseignant(enseignantId);
        setCours(data);
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la récupération des cours');
      } finally {
        setLoadingCours(false);
      }
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.id_utilisateur) {
      setEnseignantId(user.id_utilisateur);
    }
  }, []);

  useEffect(() => {
    fetchCours();
  }, [enseignantId]);

  const filteredCours = cours.filter((c) =>
    c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.matiere.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.filiere.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      try {
        await deleteCours(id);
        alert('Cours supprimé avec succès');
        fetchCours();
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression du cours');
      }
    }
  };

  const handleDownload = async (fichier) => {
    try {
      const { data, contentType } = await downloadCoursFile(fichier);
      const blob = new Blob([data], { type: contentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fichier);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur de téléchargement :', err);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  const totalPages = Math.ceil(filteredCours.length / itemsPerPage);
  const paginatedCours = filteredCours.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loadingCours) {
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
          <h2 className="text-3xl font-semibold mb-6 text-blue-800 flex items-center">
            <Book className='mr-3' /> Mes Cours
          </h2>

          <div className="mb-6 relative w-full">
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pr-10 pl-12 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {paginatedCours.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
              <p className="font-semibold">Aucun cours trouvé</p>
              <p className="text-sm">Il n'y a actuellement aucun cours à afficher.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCours.map((c) => (
                <div
                  key={c.id}
                  className="relative border border-blue-200 rounded-2xl shadow hover:shadow-lg p-5 bg-white group"
                >
                  <Book className="absolute right-4 bottom-4 w-24 h-24 text-gray-200 opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none" />

                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{c.titre}</h3>
                  <p className="text-sm text-gray-700 mb-1"><strong>Matière :</strong> {c.matiere}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Filière :</strong> {c.filiere}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Date :</strong> {new Date(c.date_creation).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Fichier :</strong> {c.fichier.length > 15 ? c.fichier.slice(0, 15) + '...' : c.fichier}
                  </p>

                  <div className="absolute top-4 right-4 flex gap-3">
                    <button onClick={() => handleDownload(c.fichier)} title="Télécharger" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200">
                      <Download className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} title="Supprimer" className="p-2 rounded-full bg-red-100 hover:bg-red-200">
                      <Trash className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursEnseignant;
