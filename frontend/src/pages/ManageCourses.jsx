import React, { useEffect, useState } from 'react';
import { getCoursList, downloadCours, deleteFichier, uploadCours } from '../api/courseService';
import { getUserRole } from '../api/authService';
import { FaDownload, FaTrash, FaPlusCircle, FaBookOpen } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ReactPaginate from 'react-paginate';

const CoursList = () => {
  const [coursList, setCoursList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = getUserRole();

  const [coursTitre, setCoursTitre] = useState('');
  const [description, setDescription] = useState('');
  const [coursFichier, setCoursFichier] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    setLoading(true);
    try {
      const data = await getCoursList();
      setCoursList(data);
    } catch (err) {
      setError('Une erreur est survenue lors de la récupération des cours.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coursId) => {
    const confirmDelete = window.confirm('Voulez-vous vraiment supprimer ce fichier ?');
    if (!confirmDelete) return;

    try {
      await deleteFichier(coursId);
      alert('Fichier supprimé avec succès.');
      fetchCours();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du fichier.');
    }
  };

  const handleCoursSubmit = async (e) => {
    e.preventDefault();
    if (!coursFichier) return alert("Fichier requis pour le cours");

    const formData = new FormData();
    formData.append('titre', coursTitre);
    formData.append('description', description);
    formData.append('fichier', coursFichier);

    try {
      await uploadCours(formData);
      alert("Cours ajouté !");
      setCoursTitre('');
      setDescription('');
      setCoursFichier(null);
      fetchCours();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’envoi du cours");
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = coursList.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(coursList.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-400  flex items-center justify-center gap-2">
            <FaBookOpen className='text-blue-400'/> Liste des Cours
          </h1>

          {userRole === 'enseignant' && (
            <form
              onSubmit={handleCoursSubmit}
              className="bg-white border border-blue-200 shadow-md rounded p-6 mb-6 max-w-xl "
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                <FaPlusCircle className="mr-2" /> Ajouter un cours
              </h2>
              <input
                className="w-full mb-3 border border-gray-300 p-2 rounded"
                type="text"
                value={coursTitre}
                onChange={(e) => setCoursTitre(e.target.value)}
                placeholder="Titre"
                required
              />
              <input
                className="w-full mb-3 border border-gray-300 p-2 rounded"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <input
                className="w-full mb-3"
                type="file"
                onChange={(e) => setCoursFichier(e.target.files[0])}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                <FaPlusCircle className="mr-2" /> Envoyer le cours
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 border-blue-200 lg:grid-cols-3 gap-6 border-t border-l">
                {currentItems.map((cours) => (
                  <div key={cours.id} className="bg-white border-blue-200 shadow-lg m-4 rounded-xl p-4 border-b border-r">
                                        <img src="/public/IMAGES/image.png" alt="task" className="w-16 h-16 mx-auto mb-3" />

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{cours.titre}</h3>
                    <p className="text-sm text-gray-600 mb-4">{cours.description}</p>
<hr/>
                    {cours.fichier && (
                      <div className="flex space-x-3">
                        {(userRole === 'etudiant' || userRole === 'administrateur') && (
                          <button
                            onClick={() => downloadCours(cours.fichier)}
                            className="flex items-center m-auto mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            <FaDownload className="mr-1" /> 
                          </button>
                        )}
                        <hr/>
                        {(userRole === 'enseignant' || userRole === 'administrateur') && (
                          <button
                            onClick={() => handleDelete(cours.id)}
                            className="flex items-center bg-red-500 m-auto text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            <FaTrash className=" m-auto" /> 
                          </button>
                        )}
                      </div>
                    )}
                    
                  </div>
                ))}
                
              </div>
              <hr/>
              <div className="mt-6 flex justify-center">
                <ReactPaginate
                  previousLabel={'← Précédent'}
                  nextLabel={'Suivant →'}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination flex space-x-2'}
                  pageClassName={'px-3 py-1 rounded border text-blue-600 border-blue-300 hover:bg-blue-100'}
                  activeClassName={'bg-blue-600 text-white'}
                  previousClassName={'px-3 py-1 rounded border text-blue-600 border-blue-300 hover:bg-blue-100'}
                  nextClassName={'px-3 py-1 rounded border text-blue-600 border-blue-300 hover:bg-blue-100'}
                  disabledClassName={'opacity-50 cursor-not-allowed'}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursList;
