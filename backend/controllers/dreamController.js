const { Dream } = require("../models");

// 🔹 Créer un nouveau rêve
exports.createDream = async (req, res) => {
  try {
    const { description, titre, dateCreation, statut, priorite, userId } =
      req.body;
    const newDream = await Dream.create({
      description,
      titre,
      dateCreation,
      statut,
      priorite,
      userId,
    });
    res.status(201).json(newDream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Récupérer tous les rêves
exports.getAllDreams = async (req, res) => {
  try {
    const dreams = await Dream.findAll();
    res.status(200).json(dreams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Récupérer un rêve par ID
exports.getDreamById = async (req, res) => {
  try {
    const { id } = req.params;
    const dream = await Dream.findByPk(id);
    if (!dream) {
      return res.status(404).json({ error: "Rêve non trouvé" });
    }
    res.status(200).json(dream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Mettre à jour un rêve par ID
exports.updateDream = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, titre, dateCreation, statut, priorite, userId } =
      req.body;

    const dream = await Dream.findByPk(id);
    if (!dream) {
      return res.status(404).json({ error: "Rêve non trouvé" });
    }

    await dream.update({
      description,
      titre,
      dateCreation,
      statut,
      priorite,
      userId,
    });

    res.status(200).json(dream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Supprimer un rêve par ID
exports.deleteDream = async (req, res) => {
  try {
    const { id } = req.params;
    const dream = await Dream.findByPk(id);
    if (!dream) {
      return res.status(404).json({ error: "Rêve non trouvé" });
    }

    await dream.destroy();
    res.status(200).json({ message: "Rêve supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
