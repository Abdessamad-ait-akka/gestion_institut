import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userService';
import { FaTrash, FaUserPlus, FaEdit } from 'react-icons/fa';
import Loader from '../components/Loader';
import { getGroupes } from '../api/groupeService'; 

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
 
  const [groupes, setGroupes] = useState([]);
  const [selectedGroupes, setSelectedGroupes] = useState([]); 
  const [editingUserId, setEditingUserId] = useState(null);

  const [form, setForm] = useState({
    nom: '',
    email: '',
    role: 'etudiant',
    mot_de_passe: '',
    matricule: '',
    matiere: '',
    niveau_acces: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchGroupes(); 
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);  
  
      const { data } = await getUsers(); 
      setUsers(data);  
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
    } finally {
      setLoading(false); 
    }
  };

  const fetchGroupes = async () => {
    try {
      const { data } = await getGroupes();
      setGroupes(data);
    } catch (err) {
      console.error('Erreur chargement groupes', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nom: form.nom,
        email: form.email,
        role: form.role,
        mot_de_passe: form.mot_de_passe,
        groupes: selectedGroupes, 
        matricule: form.matricule,  
        matiere: form.matiere,      
        niveau_acces: form.niveau_acces  
      };
      
      if (form.role === 'etudiant') payload.matricule = form.matricule;
      if (form.role === 'enseignant') payload.matiere = form.matiere;
      if (form.role === 'administrateur') payload.niveau_acces = form.niveau_acces;
  
      if (editingUserId) {
        await updateUser(editingUserId, payload);
      } else {
        await createUser(payload);
      }
  
      setForm({ nom: '', email: '', role: 'etudiant', mot_de_passe: '', matricule: '', matiere: '', niveau_acces: '' });
      setSelectedGroupes([]);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setForm({
      nom: user.nom,
      email: user.email,
      role: user.role,
      mot_de_passe: '',
      matricule: user.matricule || '',
      matiere: user.matiere || '',
      niveau_acces: user.niveau_acces || ''
    });
    setSelectedGroupes(user.groupes?.map(g => g.id) || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        const response = await deleteUser(id); 
        console.log(response);
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setForm({ nom: '', email: '', role: 'etudiant', mot_de_passe: '', matricule: '', matiere: '', niveau_acces: '' });
    setSelectedGroupes([]);
  };

  const filteredUsers = filterRole === 'all' ? users : users.filter(user => user.role === filterRole);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{editingUserId ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h2>

      <div className="card p-3 mb-5">
        <form onSubmit={handleSubmit} className="row g-3 mt-2">
          <div className="col-md-4">
            <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control" placeholder="Nom" required />
          </div>
          <div className="col-md-4">
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Email" required />
          </div>
          <div className="col-md-4">
            <select name="role" value={form.role} onChange={handleChange} className="form-select" required>
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="administrateur">Administrateur</option>
            </select>
          </div>
          <div className="col-md-4">
            <input type="password" name="mot_de_passe" value={form.mot_de_passe} onChange={handleChange} className="form-control" placeholder="Mot de passe" required={!editingUserId} />
          </div>
          
          {(form.role === 'etudiant' || form.role === 'enseignant') && (
            <div className="col-md-12">
              <label>Sélectionnez {form.role === 'etudiant' ? 'un' : 'des'} groupe(s)</label>
              <select
                className="form-select"
                multiple={form.role === 'enseignant'}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                  setSelectedGroupes(selected);
                }}
                value={selectedGroupes}
              >
                <option disabled value="">-- Sélectionnez --</option>
                {groupes.map((groupe) => (
                  <option key={groupe.id} value={groupe.id}>
                    {groupe.nom_groupe}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.role === 'etudiant' && (
            <div className="col-md-4">
              <input type="text" name="matricule" value={form.matricule} onChange={handleChange} className="form-control" placeholder="Matricule" required />
            </div>
          )}
          {form.role === 'enseignant' && (
            <div className="col-md-4">
              <input type="text" name="matiere" value={form.matiere} onChange={handleChange} className="form-control" placeholder="Matière enseignée" required />
            </div>
          )}
          
          {form.role === 'administrateur' && (
            <div className="col-md-4">
              <input type="text" name="niveau_acces" value={form.niveau_acces} onChange={handleChange} className="form-control" placeholder="Niveau d'accès" required />
            </div>
          )}

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success w-100">
              {editingUserId ? "Modifier" : "Ajouter"}
            </button>
            {editingUserId && (
              <button type="button" className="btn btn-secondary w-100" onClick={handleCancelEdit}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card p-3">
          <h4>Liste des utilisateurs</h4>

          <div className="mb-3 d-flex gap-2">
            <button className={`btn ${filterRole === 'all' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilterRole('all')}>
              Tous
            </button>
            <button className={`btn ${filterRole === 'etudiant' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilterRole('etudiant')}>
              Étudiants
            </button>
            <button className={`btn ${filterRole === 'enseignant' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilterRole('enseignant')}>
              Enseignants
            </button>
            <button className={`btn ${filterRole === 'administrateur' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilterRole('administrateur')}>
              Administrateurs
            </button>
          </div>

          <table className="table table-striped mt-3" border="2" width={1000}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">Aucun utilisateur</td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(user)}>
                        <FaEdit /> Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                        <FaTrash /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;

/*
import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, assignGroupe } from '../api/userService';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Loader from '../components/Loader';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [selectedProf, setSelectedProf] = useState(null);
  const [groupeNom, setGroupeNom] = useState('groupe');
  const [form, setForm] = useState({
    nom: '',
    email: '',
    role: 'etudiant',
    mot_de_passe: '',
    matricule: '',
    matiere: '',
    niveau_acces: ''
  });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nom: form.nom,
        email: form.email,
        role: form.role,
        mot_de_passe: form.mot_de_passe
      };
      if (form.role === 'etudiant') payload.matricule = form.matricule;
      if (form.role === 'enseignant') payload.matiere = form.matiere;
      if (form.role === 'administrateur') payload.niveau_acces = form.niveau_acces;

      if (editingUserId) {
        await updateUser(editingUserId, payload);
      } else {
        await createUser(payload);
      }
      setForm({ nom: '', email: '', role: 'etudiant', mot_de_passe: '', matricule: '', matiere: '', niveau_acces: '' });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setForm({
      nom: user.nom,
      email: user.email,
      role: user.role,
      mot_de_passe: '',
      matricule: user.matricule || '',
      matiere: user.matiere || '',
      niveau_acces: user.niveau_acces || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setForm({ nom: '', email: '', role: 'etudiant', mot_de_passe: '', matricule: '', matiere: '', niveau_acces: '' });
  };

  const handleAffecter = async () => {
    if (!selectedProf?.id || !selectedProf?.etudiantId || !groupeNom) {
      alert("Veuillez sélectionner un enseignant et saisir un nom de groupe.");
      return;
    }
    try {
      await assignGroupe({
        enseignant_id: selectedProf.id,
        etudiant_id: selectedProf.etudiantId,
        nom: groupeNom
      });
      alert('Affectation réussie');
      setSelectedProf(null);
      setGroupeNom('');
    } catch (error) {
      console.error('Erreur affectation', error);
      alert('Erreur affectation');
    }
  };

  const filteredUsers = filterRole === 'all' ? users : users.filter(user => user.role === filterRole);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{editingUserId ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h2>

      <div className="card p-3 mb-5">
        <form onSubmit={handleSubmit} className="row g-3 mt-2">
          <div className="col-md-4">
            <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control" placeholder="Nom" required />
          </div>
          <div className="col-md-4">
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Email" required />
          </div>
          <div className="col-md-4">
            <select name="role" value={form.role} onChange={handleChange} className="form-select" required>
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="administrateur">Administrateur</option>
            </select>
          </div>
          <div className="col-md-4">
            <input type="password" name="mot_de_passe" value={form.mot_de_passe} onChange={handleChange} className="form-control" placeholder="Mot de passe" required={!editingUserId} />
          </div>

          {form.role === 'etudiant' && (
            <div className="col-md-4">
              <input type="text" name="matricule" value={form.matricule} onChange={handleChange} className="form-control" placeholder="Matricule" required />
            </div>
          )}
          {form.role === 'enseignant' && (
            <div className="col-md-4">
              <input type="text" name="matiere" value={form.matiere} onChange={handleChange} className="form-control" placeholder="Matière enseignée" required />
            </div>
          )}
          {form.role === 'administrateur' && (
            <div className="col-md-4">
              <input type="text" name="niveau_acces" value={form.niveau_acces} onChange={handleChange} className="form-control" placeholder="Niveau d'accès" required />
            </div>
          )}

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success w-100">
              {editingUserId ? "Modifier" : "Ajouter"}
            </button>
            {editingUserId && (
              <button type="button" className="btn btn-secondary w-100" onClick={handleCancelEdit}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card p-3">
          <h4>Liste des utilisateurs</h4>

          <div className="mb-3 d-flex gap-2">
            {['all', 'etudiant', 'enseignant', 'administrateur'].map(role => (
              <button key={role} className={`btn ${filterRole === role ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilterRole(role)}>
                {role === 'all' ? 'Tous' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
              </button>
            ))}
          </div>

          <table className="table table-striped mt-3" border="2" width={1000}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">Aucun utilisateur</td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(user)}>
                        <FaEdit /> Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                        <FaTrash /> Supprimer
                      </button>
                      {user.role === 'etudiant' && (
                        <>
                          <select className="form-select form-select-sm w-auto" onChange={(e) => setSelectedProf({ id: e.target.value, etudiantId: user.id })}>
                            <option value="">Choisir un enseignant</option>
                            {users.filter(u => u.role === 'enseignant').map(ens => (
                              <option key={ens.id} value={ens.id}>{ens.nom}</option>
                            ))}
                          </select>
                          <input type="text" className="form-control form-control-sm w-auto" placeholder="Nom du groupe" onChange={(e) => setGroupeNom(e.target.value)} />
                          <button className="btn btn-sm btn-success" onClick={handleAffecter}>Affecter</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
*/