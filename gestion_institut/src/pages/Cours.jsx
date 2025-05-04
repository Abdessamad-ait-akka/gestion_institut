import React, { useState, useEffect } from 'react';
import {
  Card,CardContent, Typography, Button , Grid, Dialog, Box, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';

const mockCours = [
  {id: 1, titre: 'Cours de React Native', description: 'Introduction sur React', fichier: '/fichiers/react.pdf'},
  {id: 2, titre: 'Cours de Laravel', decription:'Les Routes', fichier: '/fichiers/laravel.pdf'},
];

export default function Cours(){
  const [cours, setCours] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [openDialog, setOpenDialog]= useState(false);
  const [fichier, setFichier] = useState(null);

  useEffect(() => {
    setCours(mockCours);
}, []);

const handleUpload = () => {
  //backend de AIT AKKA 
  console.log('Fichier a envoiyer pour le cours', selectedCours);
  setOpenDialog(flase);
};
return(
  <Box sx={{ padding: 4}}>
    <Typography variant="h4" gutterBottom>Espace Pedarogique</Typography>
    <Grid container spacing={3}>
      {cours.map((item)=>(
        <Grid item xs={12} md= {6} key={item.id}>
          <Card>
          <CardContent>
          <Typography variant="h6">{item.titre}</Typography>
          <Typography variant="body2" color="text.secondary">{item.description}</Typography>
          <Box mt={2}>
          <Button variant ="ontained" color="primary" href={item.fichier} download> Telecharger le cours</Button>
          <Button
          sx={{ ml: 2}}
          variant="outlined"
          color="secondary"
          onClick={()=>{
            setSelectedCours(item);
            setOpenDialog(true);
          }}
          >
            Uploader mon Devoir
          </Button>
          </Box>
          </CardContent>
          </Card>
          </Grid>
      ))}
          </Grid>

          <Dialog open={openDialog} onClose = {() => setOpenDialog(false)}>
            <DialogTitle>Uploader votre devoir</DialogTitle>
            <DialogContent>
              <input type="file" onChange={(e) => setFichier(e.target.files[0])} />

            </DialogContent>
            <DialogContent>
              <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
              <Button onClick={handleUpload} variant ="contained">Envoyer</Button>
            </DialogContent>
          </Dialog>
          </Box>
);
}

  