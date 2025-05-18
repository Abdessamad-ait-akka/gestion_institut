import React, { useState, useEffect } from 'react';
import {
  fetchGroupes,
  fetchFilieres,
  createGroupe,
  updateGroupe,
  deleteGroupe,
} from '../api/groupeApi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Pencil, Trash2, Group, ArrowDownAZ, ArrowUpZA, Search, List } from 'lucide-react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const GroupeManager = () => {
  const [groupes, setGroupes] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [nomGroupe, setNomGroupe] = useState('');
  const [idFiliere, setIdFiliere] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAZ, setSortAZ] = useState(true);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filiereFilter, setFiliereFilter] = useState('');

  useEffect(() => {
    loadGroupes();
    loadFilieres();
  }, []);

  const loadGroupes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGroupes();
      setGroupes(data);
    } catch (err) {
      setError(err.message);
      toast.error("❌ Erreur de chargement des données des Groupes!");

    } finally {
      setIsLoading(false);
    }
  };

  const loadFilieres = async () => {
    try {
      const data = await fetchFilieres();
      setFilieres(data);
    } catch (err) {
      toast.error("❌ Erreur de chargement des données des filieres!");

      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const groupeData = { nom_groupe: nomGroupe, id_filiere: idFiliere };

    try {
      if (editMode) {
        await updateGroupe(currentId, groupeData);
        toast.info("✏️ groupe modifié avec succès !");

      } else {
        await createGroupe(groupeData);
        toast.success("✅ groupe créé avec succès !");

      }
      setNomGroupe('');
      setIdFiliere('');
      setEditMode(false);
      setCurrentId(null);
      loadGroupes();
    } catch (err) {
      toast.error("❌ Erreur de modifié des données!");
      setError(err.message);
    }
  };

  const handleEdit = (groupe) => {
    setEditMode(true);
    setNomGroupe(groupe.nom_groupe);
    setIdFiliere(groupe.id_filiere);
    setCurrentId(groupe.id);
  };



  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cet groupe sera définitivement supprimé.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          toast.success("🗑️ groupe est supprimé !");
          await deleteGroupe(id);
          loadGroupes();
        } catch (error) {
          toast.error("❌ Erreur lors de la suppression !");
        }
      }
    });
  };
 

  const filteredGroupes = groupes
    .filter((groupe) => groupe.nom_groupe.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((groupe) => (filiereFilter ? groupe.id_filiere === filiereFilter : true));

  const sortedGroupes = filteredGroupes.sort((a, b) => {
    return sortAZ ? a.nom_groupe.localeCompare(b.nom_groupe) : b.nom_groupe.localeCompare(a.nom_groupe);
  });

  const totalPages = Math.ceil(sortedGroupes.length / ITEMS_PER_PAGE);
  const paginatedGroupes = sortedGroupes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen">
                  <ToastContainer position="top-right" autoClose={3000} />

      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
              <Group size={24} className="mr-2" /> Gestion des Groupes
            </h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap items-center shadow gap-4 mb-6 p-6 border border-blue-500"
            >
              <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                <input
                  type="text"
                  placeholder="Nom du groupe"
                  value={nomGroupe}
                  onChange={(e) => setNomGroupe(e.target.value)}
                  className="border border-blue-500 rounded px-4 py-2 mb-4 md:mb-0 w-full"
                  required
                />
                <select
                  value={idFiliere}
                  onChange={(e) => setIdFiliere(e.target.value)}
                  className="border border-blue-500 rounded px-4 h-10 py-2 w-full"
                  required
                >
                  <option value="">Sélectionner une filière</option>
                  {filieres.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editMode ? 'Modifier' : 'Créer'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setNomGroupe('');
                    setIdFiliere('');
                    setCurrentId(null);
                  }}
                  className="bg-gray-500 text-white w-full px-4 py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
              )}
            </form>

            <hr />

            <h3 className="text-xl text-blue-800 mt-4 font-semibold mb-3 flex items-center">
              <List size={24} className="mr-2" /> Liste des Groupes
            </h3>

            <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-4 w-full">
              <div className="relative flex items-center flex-1 min-w-0">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un groupe"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 border border-blue-500 rounded w-full py-2"
                />
              </div>

              <div className="flex-1 min-w-0">
                <select
                  value={filiereFilter}
                  onChange={(e) => setFiliereFilter(e.target.value)}
                  className="border border-blue-500 h-10 rounded w-full px-3 py-2"
                >
                  <option value="">Toutes les filières</option>
                  {filieres.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setSortAZ(!sortAZ)}
                  className="flex items-center justify-center w-full border border-blue-500 px-3 py-2 rounded hover:bg-gray-100"
                >
                  {sortAZ ? (
                    <>
                      <ArrowDownAZ className="mr-1" size={18} /> A-Z
                    </>
                  ) : (
                    <>
                      <ArrowUpZA className="mr-1" size={18} /> Z-A
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto shadow">
              <table className="w-full text-left border border-gray-200 rounded">
                <thead className="bg-gray-100">
                  <tr>
                  <th className="p-3 border-b">#</th>

                    <th className="p-3 border-b">Nom du Groupe</th>
                    <th className="p-3 border-b">Filière</th>
                    <th className="p-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGroupes.map((groupe) => (
                    <tr key={groupe.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{groupe.id}</td>
                      <td className="p-3 border-b">{groupe.nom_groupe}</td>
                      <td className="p-3 border-b">{groupe.filiere_nom}</td>
                      <td className="p-3 border-b text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(groupe)}
                            className="text-blue-600 hover:text-blue-800"
                            >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(groupe.id)}
                            className="text-red-600 hover:text-red-800"
>
<Trash2 />
</button>
</div>
</td>
</tr>
))}
{paginatedGroupes.length === 0 && (
<tr>
<td colSpan="3" className="text-center p-4 text-gray-500">
Aucun groupe trouvé.
</td>
</tr>
)}
</tbody>
</table>
</div>
<div className="flex justify-between items-center mt-4">
          <p className="text-gray-600">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="mt-4 flex text-center justify-center gap-2">
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
        </div>
      </div>
    </main>
  </div>
</div>
);
};

export default GroupeManager;
