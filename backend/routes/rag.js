// routes/rag.js
const express = require("express");
const router = express.Router();
const {
  askRAG,
  getRAGStats,
  clearRAGMemory,
  searchDocuments,
  healthCheck,
} = require("../controllers/ragController");

/**
 * POST /api/rag/ask
 * Pose une question au chatbot RAG
 */
router.post("/ask", askRAG);

/**
 * GET /api/rag/stats
 * Récupère les statistiques du système RAG
 */
router.get("/stats", getRAGStats);

/**
 * POST /api/rag/clear-memory
 * Efface l'historique de conversation
 */
router.post("/clear-memory", clearRAGMemory);

/**
 * POST /api/rag/search
 * Recherche directe dans les documents (sans génération LLM)
 */
router.post("/search", searchDocuments);

/**
 * GET /api/rag/health
 * Vérifie l'état du service RAG
 */
router.get("/health", healthCheck);

module.exports = router;
