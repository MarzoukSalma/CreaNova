// controllers/workspaceController.js
const { WorkSpace } = require("../models");

// ✅ Créer un workspace
exports.createWorkSpace = async (req, res) => {
  try {
    const { titre, description } = req.body;
       
    const workspace = await WorkSpace.create({
      titre,
      description,
      dateCreation :   new Date(),
      userId: req.user.id,
    });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer tous les workspaces
exports.getAllWorkSpaces = async (req, res) => {
  try {
    const workspaces = await WorkSpace.findAll();
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer un workspace par ID
exports.getWorkSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await WorkSpace.findByPk(id);
    if (!workspace) {
      return res.status(404).json({ message: "WorkSpace not found" });
    }
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mettre à jour un workspace
exports.updateWorkSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await WorkSpace.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: "WorkSpace not found" });
    }
    const updatedWorkSpace = await WorkSpace.findByPk(id);
    res.json(updatedWorkSpace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Supprimer un workspace
exports.deleteWorkSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WorkSpace.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "WorkSpace not found" });
    }
    res.json({ message: "WorkSpace deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
