import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Search, Book } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from './Loader'; // Composant Loader

const AllCourses = () => {
  const [cours, setCours] = useState([]);
  const [filteredCours, setFilteredCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:5001/api/cours')
      .then(response => {
        setCours(response.data);
        setFilteredCours(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des cours :', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = cours.filter(c =>
      c.titre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCours(filtered);
    setCurrentPage(1); // Réinitialisation de la page à 1 lors du filtrage
  }, [searchQuery, cours]);

  const handleDownload = (fichier) => {
    if (!fichier) {
      alert("Fichier non disponible.");
      return;
    }

    const url = `http://localhost:5001/uploads/${fichier}`;

    axios
      .get(url, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });

        const disposition = response.headers['content-disposition'];
        let filename = fichier;

        if (disposition && disposition.includes('filename=')) {
          filename = disposition
            .split('filename=')[1]
            .split(';')[0]
            .replace(/"/g, '');
        }

        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        link.href = objectUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      })
      .catch((err) => {
        console.error('Erreur de téléchargement :', err);
        alert('Erreur lors du téléchargement du fichier');
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCours = filteredCours.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCours.length / itemsPerPage);

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
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Liste des cours</h2>

          <div className="mb-6 relative w-full">
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-12 py-3 border border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : paginatedCours.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
            <p className="font-semibold">Aucune cours trouvée</p>
            <p className="text-sm">Il n'y a actuellement aucune cours à afficher .</p>
          </div>          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCours.map((c) => (
                <div
                  key={c.id}
                  className="relative border border-blue-200 rounded-2xl shadow hover:shadow-lg transition-all p-5 bg-white group overflow-hidden"
                >
                  <Book className="absolute right-4 bottom-4 w-24 h-24 text-gray-200 opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none" />

                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{c.titre}</h3>

                  <p className="text-sm text-gray-700 mb-1"><strong>Date :</strong> {new Date(c.date_creation).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Fichier :</strong> {c.fichier.length > 15 ? c.fichier.slice(0, 15) + '...' : c.fichier}
                  </p>

                  <div className="absolute top-4 right-4 flex gap-3">
                    <button onClick={() => handleDownload(c.fichier)} title="Télécharger" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all">
                      <Download className="w-5 h-5 text-blue-600 hover:text-blue-800" />
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
                  className={`px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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

export default AllCourses;
