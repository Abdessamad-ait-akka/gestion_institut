import React, { useState, useEffect } from "react";
import GenericTable from "../components/Table";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
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
  Paper,
  InputAdornment,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";

const initialProf = {
  nom: "",
  prenom: "",
  email: "",
  password: "",
  filiere: "",
  groupe: "",
  matiere: "",
};

const ProfDashboard = () => {
  const theme = useTheme();
  const [state, setState] = useState({
    Prof: [],
    openDialog: false,
    formData: initialProf,
    isEdit: false,
    editIndex: null,
    loading: true,
    errors: {},
    snackbar: { open: false, message: "", severity: "success" },
    deleteConfirm: { open: false, index: null },
    searchTerm: "",
  });

  // Simulated API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = [
          { nom: "Ait Lahcen", prenom: "Imad", email: "imad@ent.ma", password: "••••••", matiere: "React", filiere: "Génie Informatique", groupe: "G6" },
          { nom: "Benali", prenom: "Samira", email: "samira@ent.ma", password: "••••••",matiere: "Laravel", filiere: "Génie Civil", groupe: "G3" },
        ];
        setState(prev => ({ ...prev, Prof: mockData, loading: false }));
      } catch (error) {
        handleSnackbarOpen("Erreur de chargement des données", "error");
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  const handleStateUpdate = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleSnackbarOpen = (message, severity) => {
    handleStateUpdate("snackbar", { open: true, message, severity });
  };

  const validateForm = () => {
    const { formData } = state;
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email invalide";
    if (!formData.filiere.trim()) newErrors.filiere = "Filière requise";
    if (!formData.groupe.trim()) newErrors.groupe = "Groupe requis";
    handleStateUpdate("errors", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
  
    const { Prof, isEdit, editIndex, formData } = state;
    const updatedProf = [...Prof];
    const action = isEdit ? "modifié" : "ajouté";
  
    if (isEdit) {
      updatedProf[editIndex] = formData;
    } else {
      updatedProf.push({ ...formData, password: "••••••" });
    }
  
    handleStateUpdate("Prof", updatedProf); // ✅ ici était l'erreur
    handleDialogClose();
    handleSnackbarOpen(`Prof ${action} avec succès`, "success");
  };
  const handleDeleteConfirm = (index) => {
    const updated = state.Prof.filter((_, i) => i !== index);
    handleStateUpdate("Prof", updated);
    handleStateUpdate("deleteConfirm", { open: false, index: null });
    handleSnackbarOpen("Prof supprimé avec succès", "success");
  };

  const handleDialogClose = () => {
    handleStateUpdate("openDialog", false);
    handleStateUpdate("formData", initialProf);
    handleStateUpdate("errors", {});
    handleStateUpdate("isEdit", false);
  };

  const handleEdit = (row, index) => {
    handleStateUpdate("formData", {
      nom: row.nom || "",
      prenom: row.prenom || "",
      email: row.email || "",
      password: "", // On ne réaffiche jamais l’ancien mot de passe
      filiere: row.filiere || "",
      groupe: row.groupe || "",
      matiere: row.matiere || "",
    });
    handleStateUpdate("isEdit", true);
    handleStateUpdate("editIndex", index);
    handleStateUpdate("openDialog", true);
  };

  const columns = [
    { key: "nom", label: "Nom", minWidth: 150, headerStyle: { fontWeight: 600 } },
    { key: "prenom", label: "Prénom", minWidth: 150 },
    { key: "email", label: "Email", minWidth: 200 },
    { key: "filiere", label: "Filière", minWidth: 180 },
    { key: "groupe", label: "Groupe", minWidth: 120, align: "center" },
    { key: "password", label: "Mot de passe", minWidth: 140 },
    { key: "matiere", label: "Matiere", minWidth: 140 },
  ];

  const actions = [
    {
      label: "Modifier",
      icon: <EditIcon fontSize="small" />,
      color: "primary",
      onClick: (row) => {
        const index = state.Prof.findIndex(p => p.email === row.email);
        handleEdit(row, index);
      },
    },
    {
      label: "Supprimer",
      icon: <DeleteIcon fontSize="small" />,
      color: "error",
      onClick: (row) => {
        const index = state.Prof.findIndex(p => p.email === row.email);
        handleStateUpdate("deleteConfirm", { open: true, index });
      },
    },
  ];

  const filteredProf = state.Prof.filter(Prof =>
    Object.values(Prof).some(val =>
      val?.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
    )
  );

  return (
    <Paper sx={{ p: 4, m: 3, borderRadius: 4, boxShadow: theme.shadows[3] }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Gestion des Professeurs
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher des professeur..."
          value={state.searchTerm}
          onChange={(e) => handleStateUpdate("searchTerm", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 50, backgroundColor: theme.palette.background.paper }
          }}
        />
      </Box>

      {state.loading ? (
        <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <GenericTable
          columns={columns}
          rows={filteredProf}
          actions={actions}
          showActions
          showAddButton
          onAdd={() => handleStateUpdate("openDialog", true)}
          addButtonLabel="Ajouter Professeur"
          addButtonProps={{
            startIcon: <AddIcon />,
            variant: "contained",
            sx: { 
              borderRadius: 50,
              textTransform: "none",
              px: 4,
              py: 1,
              fontWeight: 600
            }
          }}
          tableProps={{
            sx: {
              "& .MuiTableCell-head": {
                backgroundColor: theme.palette.grey[100],
                fontWeight: 600,
              },
              "& .MuiTableCell-body": {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }
          }}
        />
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={state.openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main,
          color: theme.palette.common.white,
          py: 2,
          display: "flex",
          alignItems: "center"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {state.isEdit ? (
              <>
                <EditIcon fontSize="small" />
                <Typography variant="h6">Modifier le Professeur</Typography>
              </>
            ) : (
              <>
                <AddIcon fontSize="small" />
                <Typography variant="h6">Nouvel Professeur</Typography>
              </>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {Object.keys(initialProf).map((field) => (
              (state.isEdit && field === "password") ? null : (
                <Grid item xs={12} md={6} key={field}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label={columns.find(c => c.key === field)?.label || field}
                    required
                    type={field === "password" ? "password" : "text"}
                    value={state.formData[field]}
                    onChange={(e) => handleStateUpdate("formData", {
                      ...state.formData,
                      [field]: e.target.value
                    })}
                    error={!!state.errors[field]}
                    helperText={state.errors[field]}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              )
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleDialogClose}
            sx={{ 
              color: theme.palette.text.secondary,
              "&:hover": { backgroundColor: theme.palette.action.hover }
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={state.isEdit ? <EditIcon /> : <AddIcon />}
            sx={{ 
              borderRadius: 50,
              px: 4,
              textTransform: "none",
              boxShadow: 'none',
              "&:hover": { boxShadow: theme.shadows[2] }
            }}
          >
            {state.isEdit ? "Mettre à jour" : "Créer étudiant"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={state.deleteConfirm.open}
        onClose={() => handleStateUpdate("deleteConfirm", { open: false, index: null })}
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WarningIcon color="error" />
          <Typography variant="h6">Confirmer la suppression</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer définitivement cet étudiant ?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Cette action est irréversible et supprimera toutes les données associées.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={() => handleStateUpdate("deleteConfirm", { open: false, index: null })}
            sx={{ color: theme.palette.text.secondary }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleDeleteConfirm(state.deleteConfirm.index)}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
              borderRadius: 50,
              px: 4,
              textTransform: "none",
              boxShadow: 'none',
              "&:hover": { boxShadow: theme.shadows[2] }
            }}
          >
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={4000}
        onClose={() => handleStateUpdate("snackbar", { ...state.snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          severity={state.snackbar.severity} 
          sx={{ 
            width: '100%',
            boxShadow: theme.shadows[3],
            alignItems: 'center'
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
          }}
        >
          <Typography variant="body1">{state.snackbar.message}</Typography>
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfDashboard;