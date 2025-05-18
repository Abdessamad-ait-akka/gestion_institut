import React, { useEffect, useState } from 'react';
import { fetchGroupes } from '../api/groupeApi';
import { getMatieres } from '../api/matiereService';
import { createEmploi, getEmplois, updateEmploi, deleteEmploi } from '../api/emploiService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FaEdit, FaTrash, FaAngleLeft, FaAngleRight, FaSearch ,FaRegCalendarCheck} from 'react-icons/fa';
import { List } from 'lucide-react';

const EmploiCRUD = () => {
  const [groupes, setGroupes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [emplois, setEmplois] = useState([]);
  const [formData, setFormData] = useState({ groupe_id: '', matiere_id: '', jour_semaine: 'Lundi', heure_debut: '', heure_fin: '', salle: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupe, setSelectedGroupe] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gData, mData, eData] = await Promise.all([fetchGroupes(), getMatieres(), getEmplois()]);
        setGroupes(gData);
        setMatieres(mData);
        setEmplois(eData);
      } catch (err) {
        console.error('Chargement error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetForm = () => {
    setFormData({ groupe_id: '', matiere_id: '', jour_semaine: 'Lundi', heure_debut: '', heure_fin: '', salle: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) await updateEmploi(editingId, formData);
      else await createEmploi(formData);
      const updated = await getEmplois();
      setEmplois(updated);
      resetForm();
    } catch (err) {
      console.error('Sauvegarde error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emploi) => {
    setFormData({ groupe_id: emploi.groupe_id, matiere_id: emploi.matiere_id, jour_semaine: emploi.jour_semaine, heure_debut: emploi.heure_debut, heure_fin: emploi.heure_fin, salle: emploi.salle });
    setEditingId(emploi.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    setLoading(true);
    try {
      await deleteEmploi(id);
      setEmplois(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Suppression error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // filter + search
  const filtered = emplois.filter(e => {
    const matchGroup = selectedGroupe ? e.groupe_id === parseInt(selectedGroupe) : true;
    const matNom = matieres.find(m => m.id === e.matiere_id)?.nom.toLowerCase() || '';
    const matchSearch = searchTerm
      ? matNom.includes(searchTerm.toLowerCase()) || e.salle.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchGroup && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex min-h-screen">
    {/* Sidebar */}
    <div className="sticky top-0 h-screen bg-gray-800">
      <Sidebar />
    </div>

    <div className="flex-1 flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          {/* Formulaire */}
          <h2 className="text-3xl flex text-blue-800 font-semibold mb-4"> <FaRegCalendarCheck  className="mr-3"/>{editingId ? 'Modifier un emploi' : 'Ajouter un nouvel emploi'}</h2>

          <div className="w-full bg-white rounded-lg border border-blue-500 shadow p-6 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Groupe</label>
                <select name="groupe_id" value={formData.groupe_id} onChange={handleChange} required className="w-full border border-blue-500 p-2  rounded">
                  <option value="">Choisir un groupe</option>
                  {groupes.map(g => <option key={g.id} value={g.id}>{g.nom_groupe}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Matière</label>
                <select name="matiere_id" value={formData.matiere_id} onChange={handleChange} required className="w-full p-2 border border-blue-500  rounded">
                  <option value="">Choisir une matière</option>
                  {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Heure début</label>
                <input type="time" name="heure_debut" value={formData.heure_debut} onChange={handleChange} required className="w-full border border-blue-500 p-2  rounded" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Heure fin</label>
                <input type="time" name="heure_fin" value={formData.heure_fin} onChange={handleChange} required className="w-full p-2  border border-blue-500 rounded" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Jour</label>
                <select name="jour_semaine" value={formData.jour_semaine} onChange={handleChange} className="w-full p-2 border border-blue-500 rounded">
                  {['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'].map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Salle</label>
                <input type="text" name="salle" value={formData.salle} onChange={handleChange} required className="w-full p-2 border border-blue-500 rounded" />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
                {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 w-full border rounded text-gray-700">Annuler</button>}
                <button type="submit" className="px-4 py-2 w-full bg-blue-600 text-white rounded">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
          {/* Liste et filtres */}
          <h2 className="text-3xl flex text-blue-800 font-semibold mb-4">  <List size={24} className="mr-2 mt-2" /> Liste des emplois</h2>

          <div className="w-full  bg-white rounded-lg shadow p-6">
            {/* recherche + filtre groupe */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
              <div className="flex items-center border border-blue-500  rounded px-2 w-full ">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher matière ou salle..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="ml-2 p-2 flex-1  focus:outline-none"
                />
              </div>
              <select
                value={selectedGroupe}
                onChange={e => setSelectedGroupe(e.target.value)}
                className="p-2 border border-blue-500  rounded w-full "
              >
                <option value="">Tous les groupes</option>
                {groupes.map(g => <option key={g.id} value={g.id}>{g.nom_groupe}</option>)}
              </select>
            </div>
            {/* table + pagination */}
            <div className="overflow-auto">
              <table className="min-w-full bg-white border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border text-left">Groupe</th>
                    <th className="px-4 py-2 border text-left">Matière</th>
                    <th className="px-4 py-2 border text-left">Jour</th>
                    <th className="px-4 py-2 border text-left">Début</th>
                    <th className="px-4 py-2 border text-left">Fin</th>
                    <th className="px-4 py-2 border text-left">Salle</th>
                    <th className="px-4 py-2 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(e => (
                    <tr key={e.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">{groupes.find(g => g.id === e.groupe_id)?.nom_groupe || '-'}</td>
                      <td className="px-4 py-2 border">{matieres.find(m => m.id === e.matiere_id)?.nom || '-'}</td>
                      <td className="px-4 py-2 border">{e.jour_semaine}</td>
                      <td className="px-4 py-2 border">{e.heure_debut}</td>
                      <td className="px-4 py-2 border">{e.heure_fin}</td>
                      <td className="px-4 py-2 border">{e.salle}</td>
                      <td className="px-4 py-2 border text-center space-x-2">
                        <button onClick={() => handleEdit(e)} className="mx-1 text-blue-600 hover:text-blue-800"><FaEdit /></button>
                        <button onClick={() => handleDelete(e.id)} className="mx-1 text-red-600 hover:text-red-800"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded flex items-center space-x-1">
                <FaAngleLeft /><span>Préc</span>
              </button>
              {[...Array(totalPages).keys()].map(i => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>{i+1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded flex items-center space-x-1">
                <span>Suiv</span><FaAngleRight />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmploiCRUD;
