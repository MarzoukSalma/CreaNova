const db = require("./models");

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Connexion PostgreSQL OK");

    // Exemple : récupérer tous les users
    const users = await db.User.findAll();
    console.log("👤 Utilisateurs :", JSON.stringify(users, null, 2));

    // Exemple : récupérer tous les rêves d’un user
    const dreams = await db.Dream.findAll({ where: { userId: 1 } });
    console.log(
      "💭 Rêves de l’utilisateur 1 :",
      JSON.stringify(dreams, null, 2)
    );

    // Exemple : créer un workspace
    const ws = await db.WorkSpace.create({
      titre: "Mon espace de travail",
      description: "Notes pour mon projet",
      userId: 1,
    });
    console.log("📂 Nouveau workspace :", ws.toJSON());

    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
})();
