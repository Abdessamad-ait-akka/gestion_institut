// app.js
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Création du pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestions_institut',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(bodyParser.json());

// Contrôleurs
const emploiTempsController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT ed.id, ed.groupe_id, ed.matiere_id, ed.jour_semaine, ed.heure_debut, ed.heure_fin, ed.salle,
                g.nom_groupe AS groupe, m.nom AS matiere
         FROM emploi_du_temps ed
         JOIN groupe g ON ed.groupe_id = g.id
         JOIN matiere m ON ed.matiere_id = m.id
         ORDER BY FIELD(ed.jour_semaine, 'Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'), ed.heure_debut`
      );
      res.json(rows);
    } catch (err) {
      console.error('Erreur GET /emplois:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM emploi_du_temps WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ error: 'Non trouvé' });
      res.json(rows[0]);
    } catch (err) {
      console.error(`Erreur GET /emplois/${id}:`, err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  create: async (req, res) => {
    const { groupe_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle } = req.body;
    if (!groupe_id || !matiere_id || !jour_semaine || !heure_debut || !heure_fin || !salle) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    try {
      const [result] = await pool.query(
        `INSERT INTO emploi_du_temps (groupe_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [groupe_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle]
      );
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
      console.error('Erreur POST /emplois:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { groupe_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle } = req.body;
    if (!groupe_id || !matiere_id || !jour_semaine || !heure_debut || !heure_fin || !salle) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    try {
      const [result] = await pool.query(
        `UPDATE emploi_du_temps SET groupe_id=?, matiere_id=?, jour_semaine=?, heure_debut=?, heure_fin=?, salle=? WHERE id = ?`,
        [groupe_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Non trouvé' });
      res.json({ id: Number(id), ...req.body });
    } catch (err) {
      console.error(`Erreur PUT /emplois/${id}:`, err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM emploi_du_temps WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Non trouvé' });
      res.json({ message: 'Supprimé avec succès' });
    } catch (err) {
      console.error(`Erreur DELETE /emplois/${id}:`, err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

// Routes emploi du temps
app.get('/api/emplois', emploiTempsController.getAll);
app.get('/api/emplois/:id', emploiTempsController.getById);
app.post('/api/emplois', emploiTempsController.create);
app.put('/api/emplois/:id', emploiTempsController.update);
app.delete('/api/emplois/:id', emploiTempsController.delete);

// Middleware gestion erreurs et 404
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));
app.use((err, req, res, next) => {
  console.error('Middleware error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
