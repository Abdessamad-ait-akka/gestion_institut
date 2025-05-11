import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  MenuItem,
  Container,
  Paper,
  Toolbar,
  Fade,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles'; 
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const initialRows = [
  { id: 1, nom: 'Imad', prenom: 'Ait Lahcen', cin: 'TA123456', filiere: 'GI' },
  { id: 2, nom: 'Dubois', prenom: 'Sophie', cin: 'TA789012', filiere: 'TM' },
];

const FILIERES = [
  { value: 'GI', label: 'Génie Informatique' },
  { value: 'TM', label: 'Technologie Management' },
  { value: 'GE', label: 'Génie Électrique' },
  { value: 'GC', label: 'Génie Civil' },
];

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  fontWeight: 600,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  color: theme.palette.primary.main,
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    fontSize: 16,
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
  },
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(3),
}));

const EtudiantDashboard = () => {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ nom: '', prenom: '', cin: '', filiere: '' });
  const [editingId, setEditingId] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const theme = useTheme();

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = 'Nom est requis';
    if (!form.prenom.trim()) newErrors.prenom = 'Prénom est requis';
    if (!form.cin.match(/^[A-Z]{2}\d{6}$/)) newErrors.cin = 'CIN invalide (ex: TA123456)';
    if (!form.filiere) newErrors.filiere = 'Filière est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = (row = null) => {
    setErrors({});
    if (row) {
      setForm(row);
      setEditingId(row.id);
    } else {
      setForm({ nom: '', prenom: '', cin: '', filiere: '' });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingId) {
      setRows(rows.map(row => row.id === editingId ? { ...form, id: editingId } : row));
    } else {
      setRows([...rows, { ...form, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nom', headerName: 'Nom', flex: 1 },
    { field: 'prenom', headerName: 'Prénom', flex: 1 },
    { field: 'cin', headerName: 'CIN', flex: 1 },
    {
      field: 'filiere',
      headerName: 'Filière',
      flex: 1,
      valueGetter: (params) => FILIERES.find(f => f.value === params.value)?.label,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <SecondaryButton onClick={() => handleOpen(params.row)} startIcon={<EditIcon />}>
            Modifier
          </SecondaryButton>
          <PrimaryButton onClick={() => handleDelete(params.row.id)} startIcon={<DeleteIcon />} color="error">
            Supprimer
          </PrimaryButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
          <Toolbar sx={{ justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              Gestion des Étudiants
            </Typography>
            <PrimaryButton onClick={() => handleOpen()} startIcon={<AddIcon />}>
              Nouvel Étudiant
            </PrimaryButton>
          </Toolbar>

          <Box sx={{ height: 600 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitleStyled>{editingId ? 'Modifier Étudiant' : 'Ajouter Étudiant'}</DialogTitleStyled>
            <DialogContent sx={{ py: 3 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                error={!!errors.nom}
                helperText={errors.nom}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Prénom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                error={!!errors.prenom}
                helperText={errors.prenom}
              />
              <TextField
                fullWidth
                margin="normal"
                label="CIN"
                name="cin"
                value={form.cin}
                onChange={handleChange}
                error={!!errors.cin}
                helperText={errors.cin}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Filière"
                name="filiere"
                select
                value={form.filiere}
                onChange={handleChange}
                error={!!errors.filiere}
                helperText={errors.filiere}
              >
                {FILIERES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <SecondaryButton onClick={handleClose}>Annuler</SecondaryButton>
              <PrimaryButton onClick={handleSave}>
                {editingId ? 'Sauvegarder' : 'Créer'}
              </PrimaryButton>
            </DialogActions>
          </Dialog>
        </Paper>
      </Fade>
    </Container>
  );
};

export default EtudiantDashboard;
