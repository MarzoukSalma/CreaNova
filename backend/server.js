const express = require("express");
const db = require("./models");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

// Routes existantes
const inspirationRoutes = require("./routes/inspiration");
const journalRoutes = require("./routes/journalRoutes");
const authRoutes = require("./routes/auth");
const users = require("./routes/userRoutes.js");
const dreamRoutes = require("./routes/dream");
const workRoutes = require("./routes/work.js");

// 🆕 Route RAG
const ragRoutes = require("./routes/rag");

// 🧠 Génération quotidienne des inspirations
const {
  generateDailyInspirations,
} = require("./controllers/inspirationController");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route de test
app.get("/", (req, res) => {
  res.send("API Studio de Rêves Créatifs fonctionne 🚀");
});

// Routes
app.use("/journals", journalRoutes);
app.use("/auth", authRoutes);
app.use("/users", users);
app.use("/dreams", dreamRoutes);
app.use("/workspaces", workRoutes);
app.use("/inspirations", inspirationRoutes);
app.use("/rag", ragRoutes);

// Connexion DB + lancement serveur
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connexion PostgreSQL réussie !");
    return db.sequelize.sync();
  })
  .then(async () => {
    console.log("📊 Tables synchronisées !");

    // 🔥 GÉNÉRATION DES INSPIRATIONS DU JOUR

    // Lancer le serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`🚀 Serveur Express lancé sur http://localhost:${PORT}`);
      console.log(`${"=".repeat(60)}`);
      console.log(`\n📍 Routes disponibles:`);
      console.log(`   • GET  /                        - Page d'accueil`);
      console.log(`   • POST /journals                - Journaux`);
      console.log(`   • POST /auth                    - Authentification`);
      console.log(`   • GET  /users                   - Utilisateurs`);
      console.log(`   • POST /dreams                  - Rêves`);
      console.log(`   • GET  /workspaces              - Espaces de travail`);
      console.log(
        `   • GET  /inspirations/default    - Inspirations AI du jour`,
      );
      console.log(`\n🆕 Routes RAG :`);
      console.log(`   • POST /rag/ask`);
      console.log(`   • GET  /rag/stats`);
      console.log(`   • POST /rag/clear-memory`);
      console.log(`   • POST /rag/search`);
      console.log(`   • GET  /rag/health`);
      console.log(`${"=".repeat(60)}\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur connexion DB :", err);
  });
