// controllers/authController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ⚠️ Mets JWT_SECRET dans ton .env
const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

module.exports = {
  
  // 🔹 Inscription
  async register(req, res) {
    try {
      const { nom, mail, motDePasse, avatarUrl, bio, dateNaissance, phoneNumber } = req.body;

      // Vérifier si le mail est déjà utilisé
      const existingUser = await User.findOne({ where: { mail } });
      if (existingUser) {
        return res.status(400).json({ message: "Mail déjà utilisé" });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, 10);

      // Créer l'utilisateur
      const user = await User.create({
        nom,
        mail,
        motDePasse: hashedPassword,
        avatarUrl,
        bio,
        dateNaissance,
        phoneNumber
      });

      // Créer un token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        token,
        user: { id: user.id, nom: user.nom, mail: user.mail }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Connexion
  async login(req, res) {
    try {
      const { mail, motDePasse } = req.body;

      const user = await User.findOne({ where: { mail } });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Créer un token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

      res.json({
        message: "Connexion réussie",
        token,
        user: { id: user.id, nom: user.nom, mail: user.mail }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  }
};
