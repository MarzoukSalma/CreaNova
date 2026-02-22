"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dream extends Model {
    
    static associate(models) {
      
      Dream.belongsTo(models.User, { foreignKey: "userId" });
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
