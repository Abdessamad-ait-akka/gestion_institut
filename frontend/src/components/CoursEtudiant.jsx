import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Search } from 'lucide-react';
import { FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import { getCoursEtudiant, downloadFichier } from '../api/courseService';

const CoursEtudiant = () => {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(20);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'etudiant') {
      setError("Utilisateur non autorisé.");
      setLoading(false);
      return;
    }

    getCoursEtudiant(user.id_utilisateur)
      .then((data) => {
        setCours(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Erreur lors de la récupération des cours.');
        setLoading(false);
      });
  }, [user]);

  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-600" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-600" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FaFileImage className="text-yellow-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const filteredCours = cours.filter((c) =>
    c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.date_creation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCours.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownload = (fichier) => {
    if (!fichier) {
      alert("Fichier non disponible.");
      return;
    }

    downloadFichier(fichier).catch((err) => {
      console.error('Erreur de téléchargement :', err);
      alert('Erreur lors du téléchargement du fichier');
    });
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-6 text-blue-800">Les Cours disponibles</h2>

          {/* Barre de recherche */}
          <div className="mb-6 relative w-full">
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-12 py-3 border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out duration-300"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Cartes des cours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.length > 0 ? (
              currentCourses.map((c) => (
                <div key={c.id} className="bg-white rounded-xl p-5 border border-blue-200 shadow hover:shadow-lg transition duration-300 flex flex-col justify-between h-44">
                  <div>
                    <div className="flex justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {getFileIcon(c.fichier)} {c.titre}
                      </h3>
                      <p className="text-sm text-gray-500">{new Date(c.date_creation).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDownload(c.fichier)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                      <FaDownload /> Télécharger
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
              <p className="font-semibold">Aucune cours trouvée</p>
              <p className="text-sm">Il n'y a actuellement aucune cours à afficher .</p>
            </div>          
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <ul className="flex gap-2">
              {Array.from({ length: Math.ceil(filteredCours.length / coursesPerPage) }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md border ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600'
                    } hover:bg-blue-100`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursEtudiant;
