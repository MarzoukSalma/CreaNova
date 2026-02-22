// controllers/userController.js
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

module.exports = {
  async createUser(req, res) {
    try {
      const {
        nom,
        mail,
        motDePasse,
        avatarUrl,
        bio,
        dateNaissance,
        phoneNumber,
      } = req.body;
      const user = await User.create({
        nom,
        mail,
        motDePasse, // idéalement hasher avant
        avatarUrl,
        bio,
        dateNaissance,
        phoneNumber,
      });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur" });
    }
  },

  // 🔹 Récupérer le profil de l'utilisateur connecté
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Vient du middleware d'authentification

      const user = await User.findByPk(userId, {
        attributes: { exclude: ["motDePasse"] }, // Exclure le mot de passe
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({
        message: "Profil récupéré avec succès",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Récupérer un utilisateur par ID (public)
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ["motDePasse", "mail"] }, // Exclure infos sensibles
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({
        message: "Utilisateur trouvé",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Mettre à jour le profil
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { nom, avatarUrl, bio, dateNaissance, phoneNumber } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Mettre à jour seulement les champs fournis
      const updateData = {};
      if (nom !== undefined) updateData.nom = nom;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
      if (bio !== undefined) updateData.bio = bio;
      if (dateNaissance !== undefined) updateData.dateNaissance = dateNaissance;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

      await user.update(updateData);

      // Retourner l'utilisateur mis à jour sans le mot de passe
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ["motDePasse"] },
      });

      res.json({
        message: "Profil mis à jour avec succès",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Changer l'email
  async updateEmail(req, res) {
    try {
      const userId = req.user.id;
      const { newMail, motDePasse } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Vérifier le mot de passe actuel
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Vérifier si le nouveau mail n'est pas déjà utilisé
      const existingUser = await User.findOne({ where: { mail: newMail } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      await user.update({ mail: newMail });

      res.json({
        message: "Email mis à jour avec succès",
        user: { id: user.id, nom: user.nom, mail: newMail },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Changer le mot de passe
  async updatePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          message:
            "Le nouveau mot de passe doit contenir au moins 6 caractères",
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Vérifier l'ancien mot de passe
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.motDePasse
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Mot de passe actuel incorrect" });
      }

      // Hacher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ motDePasse: hashedNewPassword });

      res.json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Supprimer le compte
  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      const { motDePasse } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Supprimer l'utilisateur (CASCADE supprimera automatiquement les Dreams liés)
      await user.destroy();

      res.json({ message: "Compte supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // 🔹 Rechercher des utilisateurs
  async searchUsers(req, res) {
    try {
      const { q } = req.query; // query string

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          message: "La recherche doit contenir au moins 2 caractères",
        });
      }

      const users = await User.findAll({
        where: {
          nom: {
            [require("sequelize").Op.iLike]: `%${q.trim()}%`, // PostgreSQL
            // [require('sequelize').Op.like]: `%${q.trim()}%` // MySQL/SQLite
          },
        },
        attributes: { exclude: ["motDePasse", "mail"] },
        limit: 20,
      });

      res.json({
        message: `${users.length} utilisateur(s) trouvé(s)`,
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};
