const express = require("express");
const router = express.Router();
const dreamController = require("../controllers/dreamController");

// 🔹 Créer un nouveau rêve
router.post("/dreams", dreamController.createDream);

// 🔹 Récupérer tous les rêves
router.get("/dreams", dreamController.getAllDreams);

// 🔹 Récupérer un rêve par ID
router.get("/dreams/:id", dreamController.getDreamById);

// 🔹 Mettre à jour un rêve par ID
router.put("/dreams/:id", dreamController.updateDream);

// 🔹 Supprimer un rêve par ID
router.delete("/dreams/:id", dreamController.deleteDream);

module.exports = router;
