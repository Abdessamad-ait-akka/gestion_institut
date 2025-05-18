import React, { useState, useEffect } from 'react';
import {
  fetchUtilisateurs,
  createUtilisateur,
  deleteUtilisateur,
  updateUtilisateur,
  getUtilisateur
} from '../api/userapi';
import { fetchGroupes } from '../api/groupeApi';
import { fetchFilieres } from '../api/filiereApi';
import { getMatieres } from '../api/matiereService';
import { FaEdit, FaTrash,FaUserGraduate, FaChalkboardTeacher, FaUserShield,FaUsers } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

import { ToastContainer, toast } from 'react-toastify';

const UtilisateurForm = () => {
  const [filieres, setFilieres] = useState([]);
  const [groupesList, setGroupesList] = useState([]);
  const [filieresList, setFilieresList] = useState([]);
  const [matieresList, setMatieresList] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('etudiant');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const utilisateursParPage = 20;


  const validateForm = () => {
    const {
      nom,
      prenom,
      email,
      mot_de_passe,
      role,
      id_groupe,
      id_filiere,
      groupes,
      matieres,
      filieres,
    } = formData;
  
    if (
      !nom.trim() ||
      !prenom.trim() ||
      !email.trim() ||
      (!editMode && (!mot_de_passe || !mot_de_passe.trim()))
    ) {
      toast.error("❌ Tous les champs obligatoires doivent être remplis.");
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("❌ Email invalide.");
      return false;
    }
  
    if (role === "etudiant") {
      if (!id_groupe || !id_filiere) {
        toast.error("❌ Étudiant doit avoir un groupe et une filière.");
        return false;
      }
    }
  
    if (role === "enseignant") {
      if (
        groupes.length === 0 ||
        matieres.length === 0 ||
        filieres.length === 0
      ) {
        toast.error(
          "❌ Enseignant doit avoir au moins un groupe, une matière et une filière."
        );
        return false;
      }
    }
  
    return true;
  };
  
  
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', mot_de_passe: '',
    role: 'etudiant', id_groupe: '', id_filiere: '',
    groupes: [], matieres: [], filieres: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupes, filieres, matieres, users] = await Promise.all([
          fetchGroupes(), fetchFilieres(), getMatieres(), fetchUtilisateurs()
        ]);
        setGroupesList(groupes);
        setFilieresList(filieres);
        setMatieresList(matieres);
        setUtilisateurs(users);
        setFilieres(filieres);
      } catch (err) {
        console.error(err);
        toast.error("❌ Erreur de chargement des données!");
        setError("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  const resetForm = () => {
    setFormData({
      nom: '', prenom: '', email: '', mot_de_passe: '',
      role: 'etudiant', id_groupe: '', id_filiere: '',
      groupes: [], matieres: [], filieres: []
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleArrayChange = (e, key) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
    setFormData(prev => ({ ...prev, [key]: selected }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      if (editMode) {
        await updateUtilisateur(editId, formData);
        toast.info("✏️ Utilisateur modifié avec succès !");

      } else {
        await createUtilisateur(formData);
        toast.success("✅ Utilisateur créé avec succès !");
      }
      setUtilisateurs(await fetchUtilisateurs());
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de la soumission !");
    }
  };
  

  const handleEdit = async (id) => {
    const user = await getUtilisateur(id);
    setFormData({
      ...user,
      groupes: user.groupes || [],
      matieres: user.matieres || [],
      filieres: user.filieres || [],
      id_groupe: user.id_groupe || '',
      id_filiere: user.id_filiere || ''
    });
    setEditMode(true);
    setEditId(id);
  };

 


  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cet Utilisateur sera définitivement supprimé.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          toast.success("🗑️ Utilisateur supprimé !");
          await deleteUtilisateur(id);
          setUtilisateurs(await fetchUtilisateurs());
        } catch (error) {
          toast.error("❌ Erreur lors de la suppression !");
        }
      }
    });
  };

  const filteredUsers = utilisateurs
    .filter(u =>
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter(u => selectedRole === 'tous' || u.role === selectedRole);

  const paginate = (users) => {
    const start = (currentPage - 1) * utilisateursParPage;
    return users.slice(start, start + utilisateursParPage);
  };

  const UserSection = ({ users }) => (
    <>

{loading ? (
    <Loader />

) : (
<table className="w-full border border-gray-300 mt-4">
  <thead className="bg-blue-700 text-white">
    <tr>
      <th className="text-left p-2 border">Nom</th>
      <th className="text-left p-2 border">Prenom</th>
      <th className="text-left p-2 border">Email</th>
      <th className="text-left p-2 border">Rôle</th>
      <th className="text-left p-2 border">Infos</th>
      <th className="text-left p-2 border">Actions</th>
    </tr>
  </thead>
  <tbody>
    {paginate(users).map((u) => (
      <tr
        key={u.id}
        className={`border ${
          u.role === "etudiant"
            ? "bg-green-100"
            : u.role === "enseignant"
            ? "bg-blue-100"
            : "bg-red-100"
        }`}
      >
        <td className="p-2 border font-medium">
          {u.nom} 
          </td>

          <td className="p-2 border font-medium">

          {u.prenom}
        </td>
        <td className="p-2 border">{u.email}</td>
        <td className="p-2 border capitalize">{u.role}</td>
        <td className="p-2 border text-sm text-gray-700">
          {u.role === "etudiant" && (
            <>
              🎓 Filière : <span className="font-medium">{u.filiere?.nom || "N/A"}</span><br />
              👥 Groupe : <span className="font-medium">{u.groupe?.nom_groupe || "N/A"}</span>
            </>
          )}
          {u.role === "enseignant" && (
            <>
              👥 Groupes :{" "}
              {u.groupes?.length ? u.groupes.map((g) => g.nom_groupe).join(", ") : "Aucun"}
              <br />
              🎓 Filières :{" "}
              {u.filieres?.length ? u.filieres.map((f) => f.nom).join(", ") : "Aucune"}
              <br />
              📚 Matières :{" "}
              {u.matieres?.length ? u.matieres.map((m) => m.nom).join(", ") : "Aucune"}
            </>
          )}
        </td>
        <td className="p-2 border">
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(u.id)}
              className="text-blue-600 hover:text-blue-800"
              title="Modifier"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(u.id)}
              className="text-red-600 hover:text-red-800"
              title="Supprimer"
            >
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

)}
      <div className="flex justify-center gap-2 mt-2">
        {[...Array(Math.ceil(users.length / utilisateursParPage)).keys()].map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num + 1)}
            className={`px-3 py-1 border rounded ${currentPage === num + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            {num + 1}
          </button>
        ))}
      </div>
      
    </>
  );

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
          <h2 className="text-3xl flex text-blue-800 font-semibold mb-6"> <FaUserGraduate className='mr-2' />{editMode ? "Modifier un utilisateur" : "Créer un utilisateur"}</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow border border-blue-500 rounded p-6 mb-10">
          <select name="role" value={formData.role} onChange={handleChange} className="p-2  h-10 border border-blue-500 rounded w-full mb-4">
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="administrateur">Administrateur</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required className="p-2 border border-blue-500 rounded w-full" />
              <input name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required className="p-2 border border-blue-500 rounded w-full" />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="p-2 border border-blue-500 rounded w-full" />
              <input name="mot_de_passe" type="password" placeholder="Mot de passe" value={formData.mot_de_passe} onChange={handleChange} required className="p-2 border border-blue-500 rounded w-full" />
            </div>

          

            {formData.role === 'etudiant' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select name="id_groupe" value={formData.id_groupe} onChange={handleChange} required className="p-2  h-10 border border-blue-500 rounded">
                  <option value="">Sélectionner un groupe</option>
                  {groupesList.map(g => <option key={g.id} value={g.id}>{g.nom_groupe}</option>)}
                </select>
                <select name="id_filiere" value={formData.id_filiere} onChange={handleChange} required className="p-2  h-10 border border-blue-500 rounded">
                  <option value="">Sélectionner une filière</option>
                  {filieresList.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
              </div>
            )}

            {formData.role === 'enseignant' && (
              <>
                <div className="mb-4">
                  <label>Groupes</label>
                  <select multiple value={formData.groupes} onChange={e => handleArrayChange(e, 'groupes')} className="p-2 border border-blue-500 rounded w-full">
                    {groupesList.map(g => <option key={g.id} value={g.id}>{g.nom_groupe}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label>Matières</label>
                  <select multiple value={formData.matieres} onChange={e => handleArrayChange(e, 'matieres')} className="p-2 border border-blue-500 rounded w-full">
                    {matieresList.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label>Filières</label>
                  <select multiple value={formData.filieres} onChange={e => handleArrayChange(e, 'filieres')} className="p-2  border border-blue-500 rounded w-full">
                    {filieresList.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full rounded">{editMode ? "Mettre à jour" : "Créer"}</button>
              {editMode && (
                <button type="button" onClick={resetForm} className="bg-gray-400 text-white w-full px-4 py-2 rounded">Annuler</button>
              )}
            </div>
          </form>
          <hr className="mb-6 p-5" />
          <h2 className="text-3xl flex text-blue-800 font-semibold mb-6"> <FaUsers className='mr-2 text-5xl ' />Liste des utilisateurs</h2> 
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="p-6 h-10 w-full border  border-blue-200 rounded"
            >
              <option value="tous">Tous les rôles</option>
              <option value="etudiant">Étudiants</option>
              <option value="enseignant">Enseignants</option>
              <option value="administrateur">Administrateurs</option>
            </select>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  p-2 border border-blue-200 rounded"
            />
          </div>
          

          <UserSection users={filteredUsers} />
        </main>
      </div>
    </div>
  );
};

export default UtilisateurForm;
