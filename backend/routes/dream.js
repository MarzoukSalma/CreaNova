const express = require("express");
const router = express.Router();
const dreamController = require("../controllers/dreamController");
const { authenticateToken } = require("../middleware/auth.js");

// 🔹 Créer un nouveau rêve
router.post("/",authenticateToken, dreamController.createDream);

// 🔹 Récupérer tous les rêves
router.get("/",authenticateToken, dreamController.getalluserdreams);

// 🔹 Récupérer un rêve par ID
router.get("/:id",authenticateToken, dreamController.getdreambyid);

// 🔹 Mettre à jour un rêve par ID
router.put("/:id",authenticateToken, dreamController.updatedream);

// 🔹 Supprimer un rêve par ID
router.delete("/:id",authenticateToken, dreamController.deletedream);

module.exports = router;
