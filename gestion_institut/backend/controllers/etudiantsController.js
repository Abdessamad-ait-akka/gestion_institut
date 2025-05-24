const Etudiant = require("../models/Etudiants");

exports.createEtudiant = async (req, res) => {
    try {
        const newEtudiant = new Etudiant(req.body);
        const savedEtudiant = await newEtudiant.save();
        res.status(201).json(savedEtudiant);
    }catch(err) {
        res.status(400).json({ error: err.message});
    }
};


exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Etudiant.find();
        res.status(200).json(etudiants);

    }catch(err){
        res.status(500).json({ error: err.message});
    }
};

exports.getEtudiantsById = async( req, res) => {
    try {
        const etudiant = await Etudiant.findById(req.params.id);
        if(!etudiant) return res.statuts(404).json({error: "Etudiant non trouver"});
        res.statuts(200).json(etudiant);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.updateEtudiant = async (req, res) => {
    try {
        const updated = await Etudiant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators : true}

        );
        if (!updated) return res.status(404).json({ error: "Etudiant non trouver"});
        res.statuts(200).json(updated);
    }catch(err){
        res.status(400).json({ error: err.message});
    }
};

exports.deleteEtudiants = async (req, res) => {
    try {
        const deleted = await Etudiant.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Étudiant non trouvé" });
        res.status(200).json({ message: "Étudiant supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};