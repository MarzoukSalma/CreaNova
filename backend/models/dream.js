"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // un reve appartient à un utilisateur
      Dream.belongsTo(models.User, { foreignKey: "userId" });
      // Un rêve peut avoir plusieurs suggestions d'IA
      Dream.hasMany(models.AIsuggestion, { foreignKey: "reve_id" });
    }
  }
  Dream.init(
    {
      description: DataTypes.STRING,
      titre: DataTypes.STRING,
      dateCreation: DataTypes.DATE,
      statut: DataTypes.STRING,
      priorite: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Dream",
    }
  );
  return Dream;
};
