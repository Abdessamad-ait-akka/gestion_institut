const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const professeursRoute = require('./routes/professeursRoute');
app.use('/api/professeurs', professeursRoute); // ✅ c’est cette ligne qui expose la route

const etudiantsRoute = require('./routes/etudiantsRoute');
app.use('/api/etudiants', etudiantsRoute);
mongoose.connect('mongodb://localhost:27018/entDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(5000, () => console.log('🚀 Serveur sur http://localhost:5000'));
  })
  .catch(err => console.error('Erreur MongoDB :', err));
