// backend/server.js
const express = require("express");
const db = require("./models"); // Va chercher models/index.js
const journalRoutes = require('./routes/journalRoutes');
const authRoutes = require('./routes/auth');
const users = require('./routes/userRoutes.js');

const app = express();
const cors = require('cors') 
app.use(express.json()); // pour lire JSON
app.use(cors());
// Middleware pour lire le JSON dans les requêtes


// Route de test
app.get("/", (req, res) => {
  res.send("API Studio de Rêves Créatifs fonctionne 🚀");
});



// Routes
app.use('/journals', journalRoutes);
app.use('/auth', authRoutes);
app.use('/users', users);




// Tester la connexion à la base
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connexion PostgreSQL réussie !");
    // Synchroniser les modèles avec la base de données
    return db.sequelize.sync(); // Ajoutez cette ligne
  })
  .then(() => {
    console.log(" Tables synchronisées !");
    // Lancer le serveur après la synchronisation
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Erreur connexion DB :", err);
  });
