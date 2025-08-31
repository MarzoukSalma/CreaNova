// routes/inspirationRoutes.js
const express = require("express");
const router = express.Router();
const inspirationController = require("../controllers/inspirations.controller");

// CRUD
router.post("/", inspirationController.createInspiration);
router.get("/", inspirationController.getInspirations);
router.get("/:id", inspirationController.getInspirationById);
router.delete("/:id", inspirationController.deleteInspiration);

// Génération via Groq
router.post("/generate", inspirationController.generateInspiration);

module.exports = router;
