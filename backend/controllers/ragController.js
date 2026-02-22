// controllers/ragController.js
const axios = require("axios");

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:5000";

// ================= ASK =================
exports.askRAG = async (req, res) => {
  try {
    const { question, use_memory = true, user_id } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question manquante",
      });
    }

    const response = await axios.post(`${RAG_SERVICE_URL}/api/ask`, {
      question,
      use_memory,
      user_id,
    });

    return res.json({
      success: true,
      answer: response.data.answer,
      sources: response.data.sources,
      chunks_used: response.data.chunks_used,
    });
  } catch (error) {
    console.error("RAG ask error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'appel au service RAG",
    });
  }
};

// ================= STATS =================
exports.getRAGStats = async (req, res) => {
  try {
    const response = await axios.get(`${RAG_SERVICE_URL}/api/stats`);
    return res.json({
      success: true,
      ...response.data,
    });
  } catch (error) {
    console.error("RAG stats error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Impossible de récupérer les stats RAG",
    });
  }
};

// ================= CLEAR MEMORY =================
exports.clearRAGMemory = async (req, res) => {
  try {
    const response = await axios.post(`${RAG_SERVICE_URL}/api/clear-memory`);

    return res.json({
      success: true,
      message: response.data.message,
    });
  } catch (error) {
    console.error("RAG clear memory error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Impossible d'effacer la mémoire RAG",
    });
  }
};

// ================= SEARCH =================
exports.searchDocuments = async (req, res) => {
  try {
    const { query, top_k = 5 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query manquante",
      });
    }

    const response = await axios.post(`${RAG_SERVICE_URL}/api/search`, {
      query,
      top_k,
    });

    return res.json(response.data);
  } catch (error) {
    console.error("RAG search error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la recherche RAG",
    });
  }
};

// ================= HEALTH =================
exports.healthCheck = async (req, res) => {
  try {
    const response = await axios.get(`${RAG_SERVICE_URL}/health`);
    return res.json(response.data);
  } catch (error) {
    console.error("RAG health error:", error.message);
    return res.status(503).json({
      status: "error",
      message: "Service RAG indisponible",
    });
  }
};
