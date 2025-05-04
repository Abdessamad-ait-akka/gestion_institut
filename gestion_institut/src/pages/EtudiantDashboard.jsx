import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import{Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from '@mui/material';

const initialRows = [
  { id: 1, nom:'Imad', prenom: 'Ait Lahcen', cin: 'TA123456',filiere: 'GI'},
  { id: 2, nom: 'k', prenom: 'DOt', cin: 'TA123123', filiere: 'TM'},
];

const EtudiantDasboard = () =>
 {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ nom:'',prenom: '' , cin: '', filiere: ''});
  const [editingId, setEditingId] = React.useState(null);

  const handleOpen = (row = null) => {
    if(row) {
      setForm(row);
      setEditingId(row.id);
    }else {
      setForm({ nom: '', prenom: '', cin: '', filiere: ''});
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = ()=>{
    setOpen(false);
  };
  const handleChange= (e)=>{
    setForm({ ...form,[e.target.name]: e.target.value });

  };
  const handleSave= () =>{
    if(editingId){
      setRows(rows.map((row) =>(row.id === editingId ? { ...form, id:editingId}: row)));

    }else{
      setRows([...rows, { ...form, id: Date.now()}]);

    }
    handleClose();
  };

  const handleDElete = (id) =>{
    setRows(rows.filter((row)=> row.id!==id));
  };

  const columns =[
    { field : 'nom', header: 'Nom', width: 130},
    {field: 'prenom',headerName: 'Prenom',width: 130},
    {field : 'cin', headerName: 'Cin',width: 130 },
    { field: 'filiere', headerName: 'Filiere', width: 160},
    {
      field: 'actions', 
      headerName: 'Actions',
      width: 200,
      renderCell: (params)=>(
        <>
        <Button onClick={()=> handleOpen(params.rom)} size ="small" varient="outlined">Modifier</Button>
        <Button onClick=  {()=> handleDElete(param.row.id)} size="small" variant="outlined" color="error" style={{ marginLeft: 8}}>Supprimer</Button>
          </>
      ),
    },
  ];

  return(
    <div style={{ height: 450, width: '100%'}}>
      <h2>Gestion des Etudiants</h2>
      <Button variant="contained" onClick={() => handleOpen()} style={{ marginBottom: 10}}>Ajouter Etudiant</Button>
      <DataGrid rows ={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]}/>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingId ? 'Modifier Etudiant ' : 'Ajouter Etudiant'}
        </DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="nom" label="Nom" fullWidth value={form.nom} onChange={handleChange} />
          <TextField margin="dense" name="prenom" label="Prenom" fullWidth value={form.prenom} onChange={handleChange}/>
          <TextField margin="dense " name ="cin" label ="Cin" fullWIdth value={form.cin} onChange={handleChange}/>
          <TextField marging="dense" name="filiere" label="Filiere" fullWidth value={form.filiere} onChange={handleChange}/>
        </DialogContent>
      </Dialog>
      <Button onClick={handleClose }>Annuler</Button>
      <Button onClick ={handleSave} variant="contained">Enregistrer</Button>
    </div>
  );
}
export default EtudiantDasboard;
  