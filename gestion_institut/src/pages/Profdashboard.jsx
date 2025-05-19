import React, { useState, useEffect } from "react";
import GenericTable from '../Components/Table';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const initialProf = { nom: "", prenom: "", cin: "",  email: "",password:"",  filiere: "", groupe:"", matiere:"",   };

const ProfDashboard = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialProf);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Simulation de données initiales
    setProfesseurs([
      { nom: "Dupont", prenom: "Jean", email: "jean.dupont@example.com",  },
      { nom: "Martin", prenom: "Sophie", email: "sophie.martin@example.com" },
    ]);
  }, []);

  const handleOpen = () => {
    setFormData(initialProf);
    setIsEdit(false);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setFormData(initialProf);
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (isEdit) {
      const updated = [...professeurs];
      updated[editIndex] = formData;
      setProfesseurs(updated);
    } else {
      setProfesseurs([...professeurs, formData]);
    }
    handleClose();
  };

  const handleEdit = (row, index) => {
    setFormData(row);
    setIsEdit(true);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updated = [...professeurs];
    updated.splice(index, 1);
    setProfesseurs(updated);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prénom" },
    { key: "email", label: "Email" },
    { key: "cin", label: "cin" },
    { key: "password", label: "Password" },
    { key: "filiere", label: "Filiére" },
    { key: "groupe", label: "Groupe" },
    { key: "matiere", label: "Matiére" },
  ];

  const actions = [
    {
      label: "Modifier",
      icon: <EditIcon />,
      color: "primary",
      onClick: (row, index) => handleEdit(row, index),
    },
    {
      label: "Supprimer",
      icon: <DeleteIcon />,
      color: "error",
      onClick: (row, index) => handleDelete(index),
      stopPropagation: true,
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <GenericTable
        columns={columns}
        rows={professeurs}
        onAdd={handleOpen}
        iconOnAdd={<AddIcon />}
        actions={actions.map(action => ({
          ...action,
          onClick: (row) => action.onClick(row, professeurs.indexOf(row)),
        }))}
        showActions
        showAddButton
        tableTitle="Gestion des Professeurs"
      />

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Modifier un professeur" : "Ajouter un professeur"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="CIN"
            value={formData.cin}
            onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Filiére"
            value={formData.filiere}
            onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Groupe"
            value={formData.groupe}
            onChange={(e) => setFormData({ ...formData, groupe: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Matiére"
            value={formData.matiere}
            onChange={(e) => setFormData({ ...formData, matiere: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEdit ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfDashboard;
