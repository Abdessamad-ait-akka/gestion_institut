const mongoose = require("mongoose");

const ProfesseurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  filiere: { type: String, required: true },
  groupe: { type: String, required: true },
  matiere: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Professeur", ProfesseurSchema);
