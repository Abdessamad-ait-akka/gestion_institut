import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Paper, InputLabel} from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const MyBotton = styled(Button)({
  background: 'linear-gradient(45deg, #1E3A8A 30%, #3B82F6 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginTop: 16,
});

const CoursProf = () =>{
  const [titre, setTitre] = useState('');
  const [fichier, setFichier] = useState(null);
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log('Titre :', titre);
    console.log('Fichier :',fichier);
    alert('Cours uploade avec succes !');
  };
  
  return( 
    <Container maxWidth="sm" sx={{ mt: 6}}>
      <Paper elevattion={3} sx= {{ p:4, borderRadius: 3}}>
        <Typography variant="h5" gutterBottom align="center">
          Uploader un Cours
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
          label="Titre du cours"
          variant="outlined"
          fullWidth
          required
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          sx={{ mb:3}}
          />

          <InputLabel sx= {{ mb: 1}}>Fichier (PDF)</InputLabel>
          <input
          type="file"
          accept=".pdf"
          onCharge={(e) => setFichier(e.target.files[0])}
          required
          style={{ marginBottom: 20}}
          />

          <MyBotton type="submit" fullWidth>
            Uploader
          </MyBotton>
        </Box>
      </Paper>
    </Container>
  );
};
  
  export default CoursProf;
  