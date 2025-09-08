// routes/workspaceRoutes.js
const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");
const { authenticateToken } = require("../middleware/auth.js");

// Routes CRUD
router.post("/", authenticateToken,workspaceController.createWorkSpace); // Créer
router.get("/", authenticateToken,workspaceController.getAllWorkSpaces); // Lire tout
router.get("/:id",authenticateToken, workspaceController.getWorkSpaceById); // Lire par ID
router.put("/:id", authenticateToken,workspaceController.updateWorkSpace); // Mettre à jour
router.delete("/:id", authenticateToken, workspaceController.deleteWorkSpace); // Supprimer

module.exports = router;
