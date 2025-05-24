const express = require("express");
const router = express.Router();
const professeurController = require("../controllers/professeursController");

router.get("/", professeurController.getAllProfesseurs);
router.get("/:id", professeurController.getProfesseurById);
router.post("/", professeurController.createProfesseur);
router.put("/:id", professeurController.updateProfesseur);
router.delete("/:id", professeurController.deleteProfesseur);

module.exports = router;
