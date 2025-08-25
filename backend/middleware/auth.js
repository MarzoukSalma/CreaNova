// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

// 🔹 Middleware d'authentification obligatoire
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Token d'accès requis" });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['motDePasse'] }
    });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    req.user = user; // Ajouter l'utilisateur à la requête
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Token invalide" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token expiré" });
    }
    
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Middleware d'authentification optionnelle
const authenticateTokenOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null; // Pas de token, utilisateur anonyme
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['motDePasse'] }
    });

    req.user = user || null; // null si utilisateur supprimé
    next();

  } catch (error) {
    // En cas d'erreur, continuer comme utilisateur anonyme
    req.user = null;
    next();
  }
};

// 🔹 Middleware pour vérifier que l'utilisateur modifie ses propres données
const checkOwnership = (req, res, next) => {
  const userId = req.user.id;
  const resourceUserId = parseInt(req.params.userId || req.params.id);

  if (userId !== resourceUserId) {
    return res.status(403).json({ 
      message: "Vous ne pouvez modifier que vos propres données" 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authenticateTokenOptional,
  checkOwnership
};