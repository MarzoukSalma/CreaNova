"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //hna fen kandefeniw associations
      // Un utilisateur a plusieurs rêves
      User.hasMany(models.Dream, { foreignKey: "userId", onDelete: "CASCADE" });

      // Un utilisateur peut avoir plusieurs inspirations (et inversement)
      User.belongsToMany(models.Inspiration, {
        through: models.Inspiration_utilisateur,
        foreignKey: "userId",
        otherKey: "inspiration_id",
      });
    }
  }
  User.init(
    {
      nom: DataTypes.STRING,
      mail: DataTypes.STRING,
      motDePasse: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
