// controllers/inspirationController.js
const { Inspiration } = require("../models");
const Groq = require("groq-sdk");

// 🔑 Initialiser Groq avec ta clé API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ Créer une inspiration manuelle (par l’admin ou autre)
exports.createInspiration = async (req, res) => {
  try {
    const { contenu, date, mood } = req.body;
    const inspiration = await Inspiration.create({ contenu, date, mood });
    res.status(201).json(inspiration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer toutes les inspirations
exports.getInspirations = async (req, res) => {
  try {
    const inspirations = await Inspiration.findAll();
    res.json(inspirations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer une inspiration par ID
exports.getInspirationById = async (req, res) => {
  try {
    const { id } = req.params;
    const inspiration = await Inspiration.findByPk(id);
    if (!inspiration)
      return res.status(404).json({ error: "Inspiration non trouvée" });
    res.json(inspiration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Supprimer une inspiration
exports.deleteInspiration = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inspiration.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ error: "Inspiration non trouvée" });
    res.json({ message: "Inspiration supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Générer une inspiration via Groq en fonction du mood
exports.generateInspiration = async (req, res) => {
  try {
    const { mood } = req.body;

    // Appel Groq (LLM)
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192", // tu peux changer de modèle
      messages: [
        {
          role: "system",
          content:
            "Tu es un générateur de citations POSITIVES et COURTES. Toujours générer exactement UNE seule phrase. NE PAS mettre d'introduction, d'explication ou de texte supplémentaire.",
        },
        {
          role: "user",
          content: `Citation pour une personne qui est dans ce mood : ${mood}. Une seule phrase, très courte, positive et inspirante, sans texte d'introduction, ni guillemets,une seule phrase,  ni salutation et explication ou texte supplémentaire, en bref donner juste la citation.`,
        },
      ],
      max_tokens: 10,
    });

    const contenu = completion.choices[0].message.content;

    // Enregistrer dans la BDD
    const inspiration = await Inspiration.create({
      contenu,
      date: new Date(),
      mood,
    });

    res.status(201).json(inspiration);
  } catch (error) {
    console.error("Erreur Groq:", error);
    res.status(500).json({ error: error.message });
  }
};
