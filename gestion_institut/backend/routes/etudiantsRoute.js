const express = require("express");
const router = express.Router();
const etudiantController = require("../controllers/etudiantsController");

router.get("/", etudiantController.getAllEtudiants);
router.get("/:id", etudiantController.getEtudiantsById);
router.post("",etudiantController.createEtudiant);
router.put("/:id", etudiantController.updateEtudiant);
router.delete("/:id",etudiantController.deleteEtudiants);

module.exports = router;