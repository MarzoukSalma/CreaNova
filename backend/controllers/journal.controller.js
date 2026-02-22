const { Journal } = require("../models");

// Créer un journal
exports.createJournal = async (req, res) => {
  try {
    const { texte, userId, mood, date } = req.body;
    const journal = await Journal.create({
      texte,
      userId,
      date,
      mood,
    });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lister les journaux d'un utilisateur
exports.getUserJournals = async (req, res) => {
  try {
    const journals = await Journal.findAll({
      where: { userId: req.params.userId },
    });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Modifier un journal
exports.updateJournal = async (req, res) => {
  try {
    const { id } = req.params; // id du journal dans l'URL
    const { texte, date, mood } = req.body;

    const journal = await Journal.findByPk(id);
    if (!journal)
      return res.status(404).json({ message: "Journal non trouvé" });

    // Mettre à jour les champs
    journal.texte = texte || journal.texte;
    journal.date = date || journal.date;
    journal.mood = mood || journal.mood;
    await journal.save();

    res.json(journal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Supprimer un journal
exports.deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const journal = await Journal.findByPk(id);
    if (!journal)
      return res.status(404).json({ message: "Journal non trouvé" });

    await journal.destroy();

    res.json({ message: "Journal supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
