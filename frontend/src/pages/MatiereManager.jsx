import React, { useEffect, useState } from 'react';
import {
  getMatieres,
  getFilieres,
  createMatiere,
  updateMatiere,
  deleteMatiere,
} from '../api/matiereService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Pencil, Trash2, List, Book, Search, ArrowDownAZ, ArrowUpZA } from 'lucide-react';

const MatiereManager = () => {
  const [matieres, setMatieres] = useState([]);
  const [nom, setNom] = useState('');
  const [idFiliere, setIdFiliere] = useState('');
  const [filieres, setFilieres] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filiereFilter, setFiliereFilter] = useState('');
  const [sortAZ, setSortAZ] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const matieresPerPage = 10;

  useEffect(() => {
    fetchMatieres();
    fetchFilieres();
  }, []);

  const fetchMatieres = async () => {
    try {
      const data = await getMatieres();
      setMatieres(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFilieres = async () => {
    try {
      const data = await getFilieres();
      setFilieres(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createMatiere({ nom, id_filiere: idFiliere });
      fetchMatieres();
      setNom('');
      setIdFiliere('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette matière ?')) {
      try {
        await deleteMatiere(id);
        fetchMatieres();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (matiere) => {
    setEditMode(true);
    setNom(matiere.nom);
    setIdFiliere(matiere.id_filiere);
    setCurrentId(matiere.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateMatiere(currentId, { nom, id_filiere: idFiliere });
      fetchMatieres();
      setNom('');
      setIdFiliere('');
      setEditMode(false);
      setCurrentId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredMatieres = matieres
    .filter((m) =>
      m.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filiereFilter ? String(m.id_filiere) === String(filiereFilter) : true)
    )
    .sort((a, b) =>
      sortAZ ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)
    );

  const indexOfLastMatiere = currentPage * matieresPerPage;
  const indexOfFirstMatiere = indexOfLastMatiere - matieresPerPage;
  const currentMatieres = filteredMatieres.slice(indexOfFirstMatiere, indexOfLastMatiere);
  const totalPages = Math.ceil(filteredMatieres.length / matieresPerPage);

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
              <Book size={24} className="mr-2" /> Gestion des Matières
            </h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form
              onSubmit={editMode ? handleUpdate : handleCreate}
              className="flex  flex-wrap items-center shadow gap-4 mb-6 p-6 border border-blue-500"
            >
           <div className="flex flex-col md:flex-row md:space-x-4 w-full">
  <input
    type="text"
    placeholder="Nom de la matière"
    value={nom}
    onChange={(e) => setNom(e.target.value)}
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
                    setNom('');
                    setIdFiliere('');
                    setCurrentId(null);
                  }}
                  className="bg-gray-500 text-white w-full px-4 py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
              )}
            </form>



<hr/>
  
            <h3 className="text-xl text-blue-800 mt-4 font-semibold mb-3 flex items-center">
              <List size={24} className="mr-2" /> Liste des Matières
            </h3>
         
<div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-4 w-full">
  <div className="relative flex items-center flex-1 min-w-0">
    <Search className="absolute left-3 text-gray-400" size={18} />
    <input
      type="text"
      placeholder="Rechercher une matière"
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
                    <th className="p-3 border-b">Nom de Matiere</th>
                    <th className="p-3 border-b">Filière</th>
                    <th className="p-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMatieres.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{m.id}</td>
                      <td className="p-3 border-b">{m.nom}</td>
                      <td className="p-3 border-b">{m.filiere_nom}</td>
                      <td className="p-3 border-b text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default MatiereManager;
