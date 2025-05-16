import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Chip,
  InputLabel,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {
  AddCircleOutline,
  SaveOutlined,
  CancelOutlined,
  EditOutlined,
  DeleteOutline,
  LockResetOutlined,
} from '@mui/icons-material';

// =========================== Données initiales ===========================
const initialRows = [
  {
    id: 1,
    nom: 'Imad',
    prenom: 'Ait Lahcen',
    cin: 'TA123456',
    filieres: ['GI'],
    email: 'imad@example.com',
    groupes: ['G1'],
    password: '123456',
    lastModified: new Date().toISOString(),
  },
];
const filieresDisponibles = ['GI', 'GE', 'TM', 'RS'];
const groupesDisponibles = ['G1', 'G2', 'G4', 'G8'];

// =========================== Styles personnalisés ===========================
const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[8],
  minHeight: '80vh',
  backgroundColor: theme.palette.background.default,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  letterSpacing: 0.75,
  textTransform: 'uppercase',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

// =========================== Composant principal ===========================
const initialFormState = {
  nom: '',
  prenom: '',
  cin: '',
  filieres: [],
  email: '',
  groupes: [],
  password: '',
};

const ProfDashboard = () => {
  const theme = useTheme();
  const [rows, setRows] = React.useState(initialRows);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [formState, setFormState] = React.useState(initialFormState);
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = React.useState(false);

  // États initiaux
  
  // =========================== Validation du formulaire ===========================
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email invalide';
        break;
      case 'cin':
        if (!/^[A-Z]{2}\d{6}$/.test(value)) error = 'CIN doit être au format XX123456';
        break;
      case 'password':
        if (value.length < 6) error = 'Minimum 6 caractères';
        break;
      default:
        if (!String(value).trim()) error = 'Ce champ est obligatoire';
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formState).forEach((field) => {
      const error = validateField(field, formState[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================== Gestionnaires d'événements ===========================
  const handleDialogOpen = (student = null) => {
    if (student) {
      setFormState(student);
      setSelectedId(student.id);
    } else {
      setFormState(initialFormState);
      setSelectedId(null);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: ['filieres', 'groupes'].includes(name) && typeof value === 'string' ? value.split(',') : value,
      lastModified: new Date().toISOString(),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const handleChangeMulti = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRows((prev) => {
      if (selectedId) {
        return prev.map(row => row.id === selectedId ? 
          { ...formState, id: selectedId } : row);
      }
      return [...prev, { ...formState, id: Date.now() }];
    });
    
    setLoading(false);
    handleDialogClose();
    showSnackbar(
      selectedId ? 'Étudiant mis à jour' : 'Nouvel étudiant ajouté',
      'success'
    );
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setRows((prev) => prev.filter(row => row.id !== selectedId));
    setDeleteDialogOpen(false);
    showSnackbar('Étudiant supprimé', 'warning');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // =========================== Configuration colonnes DataGrid ===========================
  const columns = [
    { field: 'id', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center' },
    { field: 'nom', headerName: 'Nom', width: 150, editable: false },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'cin', headerName: 'CIN', width: 130 },
    { field: 'filieres', headerName: 'Filière', width: 130, renderCell: (params) => params.value?.join(', ') || '' },
    { field: 'groupes', headerName: 'Groupe', width: 100, renderCell: (params) => params.value?.join(', ') || '' },
    { field: 'email', headerName: 'Email', width: 220 },
    {
      field: 'password',
      headerName: 'Mot de passe',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockResetOutlined fontSize="small" />
          ••••••
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Modifier">
            <IconButton
              onClick={() => handleDialogOpen(params.row)}
              color="primary"
              sx={{
                background: theme.palette.primary.light + '22',
                '&:hover': { background: theme.palette.primary.main + '44' }
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
              sx={{
                background: theme.palette.error.light + '22',
                '&:hover': { background: theme.palette.error.main + '44' }
              }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DashboardPaper elevation={3}>
      {/* =========================== En-tête =========================== */}
      <Typography
  variant="h3"
  fontWeight={800}
  sx={{
    textTransform: 'uppercase',
    letterSpacing: 1,
    background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    py: 1.5,
    mb: 1,
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
  }}
>

  Gestion Des Profésseur
</Typography>

<ActionButton
  variant="contained"
  onClick={() => handleDialogOpen()}
  startIcon={<AddCircleOutline />}
  sx={{
    background: theme.palette.success.main,
    color: '#fff',
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: 2,
    boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: theme.palette.success.dark,
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
    },
  }}
>
  Nouveau Professeur
</ActionButton>


      {/* =========================== Tableau de données =========================== */}
      <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
        <Fade in={!loading} timeout={500}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[100],
                fontSize: '0.875rem',
                fontWeight: 700,
              },
              '& .MuiDataGrid-row': {
                '&:nth-of-type(even)': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }}
          />
        </Fade>
        {loading && (
          <CircularProgress
            size={48}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: theme.palette.primary.main,
            }}
          />
        )}
      </Box>

      {/* =========================== Dialogue de formulaire =========================== */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            py: 3,
          }}
        >
          {selectedId ? 'Modification Professeur' : 'Création Nouvel Professeur'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
  <Grid container spacing={3}>
    {/* Champs standards */}
    {Object.keys(initialFormState)
      .filter((field) => field !== 'filieres' && field !== 'groupes')
      .map((field) => (
        <Grid item xs={12} sm={6} key={field}>
          <TextField
            fullWidth
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            type={field === 'password' ? 'password' : 'text'}
            variant="outlined"
            name={field}
            value={formState[field]}
            onChange={handleChange}
            size="small"
            error={!!errors[field]}
            helperText={errors[field]}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>
      ))}

    {/* Sélecteur de Filières (multiple) */}
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth size="small" error={!!errors.filieres}>
        <InputLabel>Filières</InputLabel>
        <Select
          multiple
          name="filieres"
          value={formState.filieres}
          onChange={handleChangeMulti}
          input={<OutlinedInput label="Filières" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {filieresDisponibles.map((filiere) => (
            <MenuItem key={filiere} value={filiere}>
              {filiere}
            </MenuItem>
          ))}
        </Select>
        {errors.filieres && (
          <Typography variant="caption" color="error">
            {errors.filieres}
          </Typography>
        )}
      </FormControl>
    </Grid>

    {/* Sélecteur de Groupes (multiple) */}
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth size="small" error={!!errors.groupes}>
        <InputLabel>Groupes</InputLabel>
        <Select
          multiple
          name="groupes"
          value={formState.groupes}
          onChange={handleChangeMulti}
          input={<OutlinedInput label="Groupes" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {groupesDisponibles.map((groupe) => (
            <MenuItem key={groupe} value={groupe}>
              {groupe}
            </MenuItem>
          ))}
        </Select>
        {errors.groupes && (
          <Typography variant="caption" color="error">
            {errors.groupes}
          </Typography>
        )}
            </FormControl>
        </Grid>
      </Grid>
      </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <ActionButton
            onClick={handleDialogClose}
            startIcon={<CancelOutlined />}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { background: theme.palette.action.hover },
            }}
          >
            Annuler
          </ActionButton>
          <ActionButton
            onClick={handleSubmit}
            startIcon={<SaveOutlined />}
            variant="contained"
            disabled={loading}
            sx={{
              background: theme.palette.success.main,
              '&:hover': { background: theme.palette.success.dark },
              '&.Mui-disabled': { background: theme.palette.action.disabledBackground },
            }}
          >
            {selectedId ? 'Mettre à jour' : 'Créer'}
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* =========================== Dialogue de confirmation =========================== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            border: `2px solid ${theme.palette.error.light}`,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            fontWeight: 600,
            py: 2,
          }}
        >
          <DeleteOutline sx={{ verticalAlign: 'middle', mr: 1 }} />
          Confirmation de suppression
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <DialogContentText fontWeight={500}>
            Êtes-vous sûr de vouloir supprimer définitivement cet Professeur ?
          </DialogContentText>
          <DialogContentText variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
            Cette action supprimera toutes les données associées et ne peut pas être annulée.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <ActionButton
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Annuler
          </ActionButton>
          <ActionButton
            onClick={confirmDelete}
            variant="contained"
            startIcon={<DeleteOutline />}
            sx={{
              background: theme.palette.error.main,
              '&:hover': { background: theme.palette.error.dark },
            }}
          >
            Confirmer
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* =========================== Notification Snackbar =========================== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardPaper>
  );
};

export default ProfDashboard;