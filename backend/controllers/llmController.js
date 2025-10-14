// controllers/llmController.js
const fetch = require("node-fetch");

const processChat = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: "userId et message sont requis",
      });
    }

    // 🔹 Appel du backend Python (RAG)
    const pythonResponse = await fetch("http://127.0.0.1:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    });

    // 🔹 Lecture du résultat
    if (!pythonResponse.ok) {
      throw new Error(`Erreur côté Python : ${pythonResponse.statusText}`);
    }

    const data = await pythonResponse.json();

    // 🔹 Réponse finale au frontend
    res.json({
      success: true,
      data: {
        userId,
        question: message,
        answer: data.answer || "Aucune réponse trouvée.",
      },
    });
  } catch (error) {
    console.error("Erreur dans processChat:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la communication avec le chatbot Python.",
      details: error.message,
    });
  }
};

module.exports = {
  processChat,
};
