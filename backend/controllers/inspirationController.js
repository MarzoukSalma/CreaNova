// controllers/inspirationController.js
const { Inspiration, Inspiration_utilisateur } = require("../models");
const Groq = require("groq-sdk");
const { Op } = require("sequelize");

// 🔑 Initialiser Groq avec ta clé API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Moods par défaut
const DEFAULT_MOODS = ['heureux', 'triste', 'anxieux', 'motivé', 'calme', 'énergique'];

// ✅ Créer une inspiration manuelle (par l'utilisateur)
exports.createInspiration = async (req, res) => {
  try {
    const { contenu, mood } = req.body;
      const userId = req.user.id;
    console.log('Utilisateur connecté:', userId);
    
    const inspiration = await Inspiration.create({ 
      contenu, 
      date: new Date(),
      mood,
      createur: 'user' 
    });

   // Associer au user connecté
await inspiration.addUser(userId);

    res.status(201).json(inspiration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer les inspirations personnelles de l'utilisateur
exports.getUserInspirations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les IDs des inspirations de cet utilisateur
    const inspirationsIds = await Inspiration_utilisateur.findAll({
      where: { userId: userId },
      attributes: ['inspiration_id'],
    });

    // Récupérer toutes les inspirations correspondantes
    const inspirations = await Inspiration.findAll({
      where: { id: inspirationsIds.map(i => i.inspiration_id) },
      order: [['createdAt', 'DESC']]
    });

    // Si aucune inspiration trouvée
    if (!inspirations || inspirations.length === 0) {
      return res.status(404).json({ error: "Aucune inspiration trouvée pour cet utilisateur" });
    }

    res.json(inspirations);
  } catch (error) {
    console.error("Erreur getUserInspirations:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer les inspirations AI pour les moods par défaut (du jour)
exports.getDefaultMoodInspirations = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const inspirations = await Inspiration.findAll({
      where: {
        createur: 'ai',
        mood: { [Op.in]: DEFAULT_MOODS },
        createdAt: {
          [Op.between]: [startOfToday, endOfToday]
        }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(inspirations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer les inspirations personnalisées pour un mood spécifique de l'utilisateur
exports.getPersonalizedInspirations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mood } = req.params;

    const inspirations = await Inspiration.findAll({
      include: [{
        model: Inspiration_utilisateur,
        where: { userId: userId },
        attributes: []
      }],
      where: { 
        createur: 'ai',
        mood: mood
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(inspirations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Générer une inspiration via Groq pour un mood personnalisé
exports.generatePersonalizedInspiration = async (req, res) => {
  try {
    const { mood } = req.body;
    const userId = req.user.id;

    // Appel Groq (LLM)
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Tu es un générateur de citations POSITIVES, COURTES (max 20 mots), en français. Toujours générer EXACTEMENT UNE seule phrase, jamais d'explications ni de guillemets."
        },
        {
          role: "user",
          content: `Génère une citation positive et courte pour quelqu'un qui se sent "${mood}".`
        }
      ],
      max_tokens: 50
    });

    const contenu = completion.choices[0].message.content;

    // Enregistrer dans la BDD
    const inspiration = await Inspiration.create({
      contenu,
      date: new Date(),
      mood,
      createur: 'ai'
    });

    // Associer à l'utilisateur
    await Inspiration_utilisateur.create({
      userId: userId,
      inspiration_id: inspiration.id
    });

    res.status(201).json(inspiration);
  } catch (error) {
    console.error("Erreur Groq:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Générer automatiquement 2 inspirations par jour pour chaque mood par défaut (tâche cron)
exports.generateDailyInspirations = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    for (const mood of DEFAULT_MOODS) {
      // Vérifier si on a déjà généré 2 inspirations pour ce mood aujourd'hui
      const existingCount = await Inspiration.count({
        where: {
          mood: mood,
          createur: 'ai',
          createdAt: {
            [Op.between]: [startOfToday, endOfToday]
          }
        }
      });

      if (existingCount < 2) {
        const inspirationsToGenerate = 2 - existingCount;
        
        for (let i = 0; i < inspirationsToGenerate; i++) {
          const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: "Tu es un générateur de citations POSITIVES, COURTES (max 20 mots), en français. Toujours générer EXACTEMENT UNE seule phrase, jamais d'explications ni de guillemets."
              },
              {
                role: "user",
                content: `Génère une citation positive et courte pour quelqu'un qui se sent "${mood}".`
              }
            ],
            max_tokens: 50
          });

          const contenu = completion.choices[0].message.content;

          await Inspiration.create({
            contenu,
            date: new Date(),
            mood,
            createur: 'ai'
          });
        }
      }
    }
    
    console.log("Inspirations quotidiennes générées avec succès");
  } catch (error) {
    console.error("Erreur lors de la génération quotidienne:", error);
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

// ✅ Supprimer une inspiration (seulement si créée par l'utilisateur)
exports.deleteInspiration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que l'inspiration appartient à l'utilisateur
    const inspirationUser = await Inspiration_utilisateur.findOne({
      where: { inspiration_id: id, userId: userId }
    });

    if (!inspirationUser) {
      return res.status(403).json({ error: "Non autorisé à supprimer cette inspiration" });
    }

    const inspiration = await Inspiration.findByPk(id);
    if (!inspiration || inspiration.createur !== 'user') {
      return res.status(404).json({ error: "Inspiration non trouvée ou non supprimable" });
    }

    await Inspiration_utilisateur.destroy({ where: { inspiration_id: id, userId: userId } });
    await Inspiration.destroy({ where: { id } });
    
    res.json({ message: "Inspiration supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};