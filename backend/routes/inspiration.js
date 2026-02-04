// routes/inspirationRoutes.js
const express = require("express");
const router = express.Router();
const inspirationController = require("../controllers/inspirationController.js");
const { authenticateToken } = require("../middleware/auth.js");
// ⚡ Toutes les routes nécessitent un utilisateur connecté
router.post("/", authenticateToken, inspirationController.createInspiration);
// ➝ Créer une inspiration manuelle

router.get(
  "/user",
  authenticateToken,
  inspirationController.getUserInspirations,
);
// ➝ Récupérer les inspirations de l'utilisateur connecté

router.get(
  "/default",
  authenticateToken,
  inspirationController.getDefaultMoodInspirations,
);
// ➝ Récupérer les inspirations AI par défaut du jour

router.get(
  "/personalized/:mood",
  authenticateToken,
  inspirationController.getPersonalizedInspirations,
);
// ➝ Récupérer les inspis AI personnalisées d’un mood précis

router.post(
  "/generate",
  authenticateToken,
  inspirationController.generatePersonalizedInspiration,
);
// ➝ Générer une inspiration AI personnalisée pour l'utilisateur

router.get("/:id", authenticateToken, inspirationController.getInspirationById);
// ➝ Récupérer une inspiration par ID

router.delete(
  "/:id",
  authenticateToken,
  inspirationController.deleteInspiration,
);
// ➝ Supprimer une inspiration (seulement si créée par l'utilisateur)

module.exports = router;
