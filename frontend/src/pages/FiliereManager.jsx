import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

import {
  fetchFilieres,
  createFiliere,
  updateFiliere,
  deleteFiliere,
} from '../api/filiereApi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { List,Pencil, Trash2 } from 'lucide-react';

import { Layers } from 'lucide-react';
import Loader from '../components/Loader';
const FiliereManager = () => {
  const [filieres, setFilieres] = useState([]);
  const [nom, setNom] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const loadFilieres = async () => {
    setLoading(true);
    try {
      const data = await fetchFilieres();
      setFilieres(data);
    } catch (err) {
      setError(err.message);
      toast.error("❌ Erreur de chargement des données!");

    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadFilieres();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createFiliere({ nom });
      setNom('');
      toast.success("✅ Filières créé avec succès !");
      loadFilieres();
    } catch (err) {
      toast.error("❌ Erreur d'ajout  des données!");
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateFiliere(currentId, { nom });
      toast.info("✏️ Filières modifié avec succès !");

      setNom('');
      setEditMode(false);
      setCurrentId(null);
      loadFilieres();
    } catch (err) {
      toast.error("❌ Erreur de modifié des données!");

      setError(err.message);
    }
  };

 

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cet filière sera définitivement supprimé.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          toast.success("🗑️ filière est supprimé !");
          await deleteFiliere(id);
          loadFilieres();
        } catch (error) {
          toast.error("❌ Erreur lors de la suppression !");
        }
      }
    });
  };

  const handleEdit = (filiere) => {
    setEditMode(true);
    setNom(filiere.nom);
    setCurrentId(filiere.id);
  };

  // Filtrage + Tri
  const filteredFilieres = filieres
    .filter(f => f.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.nom.toLowerCase();
      const nameB = b.nom.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFilieres = filteredFilieres.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFilieres.length / itemsPerPage);

  return (
    <div className="flex min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />

      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <h2 className="text-2xl text-blue-800 font-bold flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-blue-600" />
            Gestion des Filières
          </h2>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <form
            onSubmit={editMode ? handleUpdate : handleCreate}
            className="bg-white p-4 rounded border border-blue-500 shadow mb-6 flex items-center gap-4"
          >
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de la filière"
              required
              className="flex-1 border border-blue-500 rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              {editMode ? <><FaSave /> Modifier</> : <><FaPlus /> Créer</>}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setNom('');
                  setCurrentId(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
              >
                <FaTimes /> Annuler
              </button>
            )}
          </form>
<hr/>
          <h3 className="text-xl text-blue-800 mt-4 font-semibold mb-3 flex items-center">
              <List size={24} className="mr-2" /> Liste des filière
            </h3>
          {/* Recherche et tri */}
          <div className="mb-6 flex items-center justify-between gap-4 max-w-xl">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une filière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              title="Trier les filières"
            >
              {sortOrder === 'asc' ? (
                <>
                  <FaSortAlphaDown /> A-Z
                </>
              ) : (
                <>
                  <FaSortAlphaUp /> Z-A
                </>
              )}
            </button>
          </div>

          {loading ? (
  <div className="flex justify-center py-10">
    <Loader />
  </div>
) : (
  <>
    {/* Table des filières */}
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded table-striped">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 border-b">#</th>
            <th className="text-left p-3 border-b">Nom</th>
            <th className="text-left p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFilieres.map((filiere, index) => (
            <tr key={filiere.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{indexOfFirst + index + 1}</td>
              <td className="p-3 border-b font-medium">{filiere.nom}</td>
              <td className="p-3 border-b">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(filiere)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Modifier"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => handleDelete(filiere.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {currentFilieres.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                Aucune filière trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="mt-4 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded border ${
            currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </>
)}


       
        </main>
      </div>
    </div>
  );
};

export default FiliereManager;
