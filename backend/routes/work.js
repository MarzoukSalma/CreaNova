// routes/workspaceRoutes.js
const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

// Routes CRUD
router.post("/", workspaceController.createWorkSpace); // Créer
router.get("/", workspaceController.getAllWorkSpaces); // Lire tout
router.get("/:id", workspaceController.getWorkSpaceById); // Lire par ID
router.put("/:id", workspaceController.updateWorkSpace); // Mettre à jour
router.delete("/:id", workspaceController.deleteWorkSpace); // Supprimer

module.exports = router;
