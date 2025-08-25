// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔹 Route d'inscription
router.post('/register', authController.register);

// 🔹 Route de connexion
router.post('/login', authController.login);

module.exports = router;
