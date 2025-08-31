const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth.js");

// 🔹 Routes publiques
router.get("/search", userController.searchUsers);
router.get("/:id", userController.getUserById);

// 🔹 Route publique pour créer un utilisateur
router.post("/", userController.createUser); // hada li kan dayr lina mochkil f postman
// 🔹 Routes protégées
router.get("/profile/me", authenticateToken, userController.getProfile);
router.put("/profile/me", authenticateToken, userController.updateProfile);
router.put("/profile/email", authenticateToken, userController.updateEmail);
router.put(
  "/profile/password",
  authenticateToken,
  userController.updatePassword
);
router.delete("/profile/me", authenticateToken, userController.deleteAccount);

module.exports = router;
