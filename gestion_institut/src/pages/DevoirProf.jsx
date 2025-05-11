import React, { useState } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

const initialDevoirs = [
  {
    id: 1,
    titre: 'TP React',
    matiere: 'React',
    fichier: '/devoirs/tp_reseaux.pdf'
  },
  {
    id: 2,
    titre: 'TP reseau',
    matiere: 'React',
    fichier: '/devoirs/tp_reseaux.pdf'
  },
];
const DevoirProf= () =>{
  const [searchTerm, setSearchTerm] = useState('');
  const [matiereFiltre, setMatiereFiltre]= useState('');
  const [devoirs]= useState(inistialDevoirs);

  const filtredRows= devoirs.filter((devoir)=>{
    const matchesMatiere= matiereFiltre ? devoir.matiere === matiereFiltre : true;
    const matchSearch = '${devoir.titre} ${devoir.etudiant}'
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      return matchesMatiere && matchesSearch;
  });
  const colonnes = [
    { field: 'titre', headerName: 'Titre', flex: 1},
    { filed: 'etudiant', headerName:'Etudiant' , flex:1},
    { field: 'matiere', headerName: 'Matiere', flex:1},
    {
      field: 'actions',
      headerName:'Telechatger',
      flex: 1,
      renderCell: (params) =>(
        <Button
        variant="outlined"
        color="primary"
        href={params.row.fichier}
        download
        >
          Telecharger
        </Button>
      ),
    },
  ];
  const matiereDisponibles = [...new Set(devoirs.map((d)=> d.matiere))];

  return(
    <Box sx={{ p:3}}>
      <Typography variant="h4" gutterBottom>
        Devoirs des Etudiants
      </Typography>
      <Box sx={{ diplay: 'flex', gap: 2, mb:2}}>
        <TextField
        label="Rechercher un devoir ou étudiant"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
         <TextField
          select
          label="Filtrer par matière"
          value={matiereFiltre}
          onChange={(e) => setMatiereFiltre(e.target.value)}
          sx={{ width: 250 }}
        >
          <MenuItem value="">Toutes les matières</MenuItem>
          {matieresDisponibles.map((matiere) => (
            <MenuItem key={matiere} value={matiere}>
              {matiere}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={colonnes}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
  
  export default DevoirProf;
  