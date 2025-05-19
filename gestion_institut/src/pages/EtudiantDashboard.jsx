import React, { useState, useEffect } from "react";
import GenericTable from "../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";

const initialEtudiant = {
  nom: "",
  prenom: "",
  email: "",
  password: "",
  filiere: "",
  groupe: "",
};

const EtudiantDashboard = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialEtudiant);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, index: null });

  // Simulated API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = [
          { nom: "Ait Lahcen", prenom: "Imad", email: "imad@ent.ma", password: "••••••", filiere: "Génie Informatique", groupe: "G6" },
          { nom: "Benali", prenom: "Samira", email: "samira@ent.ma", password: "••••••", filiere: "Génie Civil", groupe: "G3" },
        ];
        setEtudiants(mockData);
      } catch (error) {
        setSnackbar({ open: true, message: "Erreur de chargement des données", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email invalide";
    if (!formData.filiere.trim()) newErrors.filiere = "Filière requise";
    if (!formData.groupe.trim()) newErrors.groupe = "Groupe requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedEtudiants = [...etudiants];
    const action = isEdit ? "modifié" : "ajouté";

    if (isEdit) {
      updatedEtudiants[editIndex] = formData;
    } else {
      updatedEtudiants.push({ ...formData, password: "••••••" });
    }

    setEtudiants(updatedEtudiants);
    handleClose();
    setSnackbar({ open: true, message: `Étudiant ${action} avec succès`, severity: "success" });
  };

  const handleDeleteConfirm = (index) => {
    const updated = etudiants.filter((_, i) => i !== index);
    setEtudiants(updated);
    setDeleteConfirm({ open: false, index: null });
    setSnackbar({ open: true, message: "Étudiant supprimé avec succès", severity: "success" });
  };
  const handleClose = () => {
    setFormData(initialEtudiant);
    setOpenDialog(false);
  };

  const handleEdit = (row, index)=> {
    setFormData(row);
    setIsEdit(true);
    setEditIndex(index);
    setOpenDialog(true);
  };
  const handleDelete = (index) => {
    const updated = [...etudiants];
    updated.splice(index, 1);
    setEtudiants(updated);
  };

  const columns = [
    { key: "nom", label: "Nom", minWidth: 120 },
    { key: "prenom", label: "Prénom", minWidth: 120 },
    { key: "email", label: "Email", minWidth: 200 },
    { key: "filiere", label: "Filière", minWidth: 150 },
    { key: "groupe", label: "Groupe", minWidth: 100 },
    { key: "password", label: "Mot de passe", minWidth: 120 },
  ];

  const actions = [
    {
      label: "Modifier",
      icon: <EditIcon fontSize="small" />,
      color: "primary",
      onClick: (row, index) => handleEdit(row, index),
    },
    {
      label: "Supprimer",
      icon: <DeleteIcon fontSize="small" />,
      color: "error",
      onClick: (row, index) => setDeleteConfirm({ open: true, index }),
    },
  ];

  return (
    <Box sx={{ p: 3, position: "relative" }}>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <GenericTable
        columns={columns}
        rows={etudiants}
        loading={loading}
        onAdd={() => {
          setFormData(initialEtudiant);
          setIsEdit(false);
          setOpenDialog(true);
        }}
        actions={actions}
        showActions
        showAddButton
        tableTitle="Gestion des Étudiants"
        addButtonLabel="Nouvel Étudiant"
        addButtonProps={{
          startIcon: <AddIcon />,
          variant: "contained",
          sx: { mb: 2 }
        }}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="md" TransitionComponent={Fade}>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {isEdit ? "Modifier l'Étudiant" : "Nouvel Étudiant"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Nom"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                error={!!errors.nom}
                helperText={errors.nom}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Prénom"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                error={!!errors.prenom}
                helperText={errors.prenom}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Filière"
                required
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                error={!!errors.filiere}
                helperText={errors.filiere}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Groupe"
                required
                value={formData.groupe}
                onChange={(e) => setFormData({ ...formData, groupe: e.target.value })}
                error={!!errors.groupe}
                helperText={errors.groupe}
              />
            </Grid>
            {!isEdit && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Mot de passe"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Annuler</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={isEdit ? <EditIcon /> : <AddIcon />}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, index: null })}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet étudiant ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, index: null })}>Annuler</Button>
          <Button
            onClick={() => handleDeleteConfirm(deleteConfirm.index)}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EtudiantDashboard;