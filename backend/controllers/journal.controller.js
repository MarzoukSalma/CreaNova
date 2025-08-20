const { Journal } = require('../models');

// Créer un journal
exports.createJournal = async (req, res) => {
  try {
    const { titre, description, utilisateur_id,mood ,date} = req.body;
    const journal = await Journal.create({
      titre,
      description,
      utilisateur_id,
      date,
      mood
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
      where: { userId: req.params.userId }
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
    const { titre, description,date ,mood} = req.body;

    const journal = await Journal.findByPk(id);
    if (!journal) return res.status(404).json({ message: "Journal non trouvé" });

    // Mettre à jour les champs
    journal.titre = titre || journal.titre;
    journal.description = description || journal.description;
    journal.date = date || journal.date;
    journal.mood = mood || journal.mood; // Mise à jour du champ mood
    // Enregistrer les modifications

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
    if (!journal) return res.status(404).json({ message: "Journal non trouvé" });

    await journal.destroy();

    res.json({ message: "Journal supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
