// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";


// Middleware pour authentification obligatoire
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(401).json({ error: 'Token mal formé' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['motDePasse'] } });

    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

    req.user = user; // ✅ Ici on met l'utilisateur dans req.user
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = { authenticateToken };

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