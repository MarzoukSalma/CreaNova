const {Dream} = require('../models');

// Create and Save a new Dream
exports.createDream = async (req, res) => {
try{ userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
  const {description, titre, dateCreation, statut, priorite}=req.body;
  const newdream= await Dream.create({
    description,
    titre,
    dateCreation,
    statut,
    priorite,
    userId : userId, // Associer le rêve à l'utilisateur
  });
  console.log("New dream created:", newdream); // 🔥 Vérifier la création
    res.status(201).json(newdream);

}catch(error){
  res.status(500).json({message: error.message}); 

};
}
exports.getalluserdreams = async (req, res) => {
  try {
    console.log("User from token:", req.user); // 🔥 Vérifier le user
    const userId = req.user.id;
    const dreams = await Dream.findAll({ where: { userId } });
    console.log("Dreams found:", dreams); // 🔥 Vérifier ce que sequelize retourne
    res.status(200).json(dreams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//🔹 Récupérer un rêve par son ID
 exports.getdreambyid=async(req,res)=>{
  try{
  const userId =req.params.userId;
  const dream = Dream.findByPk(req.params.id);
  if (!dream || dream.userId !== req.user.id)
    return res.status(404).json({ message: "Dream not found" });
  res.status(200).json(dream);
}
catch(error){
  res.status(500).json({message: error.message});   };}



//🔹 Mettre à jour un rêve
exports.updatedream = async (req, res) => {
  try {
    const dream = await Dream.findByPk(req.params.id);

    if (!dream || dream.userId !== req.user.id) {
      return res.status(404).json({ message: "Dream not found" });
    }

    const { description, titre, dateCreation, statut, priorite } = req.body;
    Object.assign(dream, { description, titre, dateCreation, statut, priorite });
    await dream.save();

    res.status(200).json(dream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





//🔹 Supprimer un rêve
exports.deletedream = async (req, res) => {
  try {
    const dream = await Dream.findByPk(req.params.id);

    if (!dream || dream.userId !== req.user.id) {
      return res.status(404).json({ message: "Dream not found" });
    }

    await dream.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
