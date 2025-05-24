const Professeur = require("../models/Professeur");

exports.createProfesseur = async (req, res) => {
  try {
    const newProf = new Professeur(req.body);
    const savedProf = await newProf.save();
    res.status(201).json(savedProf);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📄 Obtenir tous les professeurs
exports.getAllProfesseurs = async (req, res) => {
  try {
    const profs = await Professeur.find();
    res.status(200).json(profs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Obtenir un professeur par ID
exports.getProfesseurById = async (req, res) => {
  try {
    const prof = await Professeur.findById(req.params.id);
    if (!prof) return res.status(404).json({ error: "Professeur non trouvé" });
    res.status(200).json(prof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier un professeur
exports.updateProfesseur = async (req, res) => {
  try {
    const updated = await Professeur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Professeur non trouvé" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Supprimer un professeur
exports.deleteProfesseur = async (req, res) => {
  try {
    const deleted = await Professeur.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Professeur non trouvé" });
    res.status(200).json({ message: "Professeur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
