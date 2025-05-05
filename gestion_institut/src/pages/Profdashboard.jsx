import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const initialRows = [
  {id: 1, nom: 'alaoui', prenom:'Mohamed',cin:'PA124444', email:'ALAui@ent.ma'},
  {id: 1, nom: 'alaoui', prenom:'Mohamed',cin:'PA124444', email:'ALAui@ent.ma'},
];

const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #1E3A8A 30%, #3B82F6 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(74, 144, 226, .3)',
  color: 'white',
  height: 36,
  padding: '0 20px',
  margin: '0 4px',
  '&:hover': {
    background: 'linear-gradient(45deg, #1A2F75 30%, #2D70D8 90%)',
  },
});

const DeleteButton = styled(Button)({
  background: 'linear-gradient(45deg, #D32F2F 30%, #F44336 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(211, 47, 47, .3)',
  color: 'white',
  height: 36,
  padding: '0 20px',
  margin: '0 4px',
  '&:hover': {
    background: 'linear-gradient(45deg, #B71C1C 30%, #D32F2F 90%)',
  },
});

const ProfDashboard = ()=>{
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({nom:'', prenom:'', cin:'', email:''});
  const [editingId, setEditingId] = React.useState(null);

  const handleOpen = (row = null) =>{
    if(row){
      setForm(row);
      setEditingId(row.id);

    }else{
      setForm({nom:'', prenom:'', cin:'', email:''});
      setEditingId(null);
    }
    setOpen(true);
  };
  const handleClose = () =>{
    setOpen(false);
  };

  const handleChange = (e)=>{
    setForm({ ...form,[e.target.name]: e.target.value});
  };
  const handleSave= () =>{
    if(editingId ){
      setRows(rows.map((row)=>(row.id === editingId ? { ...form, id: edittingId }: row)));

    }else{
      setRows([...rows, { ...form, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if(window.confirm('Etes vous sur de supprimer cet prof')){
      setRows(rows.filter((row) => row.id !== id));
    }
};
  const columns =[
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nom', headerName: 'Nom', width: 130 },
    { field: 'prenom', headerName: 'Prénom', width: 130 },
    { field: 'cin', headerName: 'CIN', width: 130 },
    { field: 'email', headerName: 'Email', width: 160 },
    {
      field:'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params)=>(
        <>
        <MyButton
        onClick={() => handleOpen(params.row)}
        size="small"
        >
          Modifier
        </MyButton>
        <DeleteButton
        onClick={()=> handleDelete(params.row.id)}
        size="small"
        >
          Supprimer
        </DeleteButton>
        </>
      ),
    },
  ];

  return( 
    <Box sx={{ height: 600, width: '100%', padding: 3}}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3}}>
        Gestion Des Profs
      </Typography>
      <MyButton
      variant="contained"
      onClick={()=> handleOpen()}
      sx={{ mb:2 }}
      >
        Ajouter Prof
      </MyButton>
      <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptionOnCLick
      sx={{
        '& .MuiDataGrid-cell:hover':{
          color: 'primary.main',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundcolor: '#f5f5f5',
        },
      }}
      />
      <Dialog open ={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Modifier Prof': 'Ajouter Etudiant'}</DialogTitle>
        <DialogContent>
          <TextField
          margin="dense"
          name="nom"
          label="Nom"
          fullWidth
          value={form.nom}
          onChange={handleChange}
          sx={{ mb:2 }}
          />
          <TextField
          margin="dense"
          name="prenom"
          label="Prenom"
          fullWidth
          value={form.prenom}
          onChange={handleChange}
          sx={{ mb:2 }}
          />
          <TextField
          margin="dense"
          name="cin"
          label="CIN"
          fullWidth
          value={form.cin}
          onChange={handleChange}
          sx={{ mb:2 }}
          />
          <TextField
          margin="dense"
          name="email"
          label="email"
          fullWidth
          value={form.email}
          onChange={handleChange}
          sx={{ mb:2 }}
          />
        </DialogContent>
        <DialogActions>
          <DeleteButton onClick={handleClose} color="primary">
            Annuler
          </DeleteButton>
          <MyButton onClick={handleSave} variant="contained">
            Enregistrer
          </MyButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
  
  export default ProfDashboard;
  