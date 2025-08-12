"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AIsuggestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AIsuggestion.belongsTo(models.Dream, { foreignKey: "reve_id" });
    }
  }
  AIsuggestion.init(
    {
      contenu: DataTypes.TEXT,
      reve_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AIsuggestion",
    }
  );
  return AIsuggestion;
};
