"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
   
    static associate(models) {
   Journal.belongsTo(models.User, {
    foreignKey: "userId",
   
  });
    }
  }
  Journal.init(
    {
      mood: DataTypes.TEXT,
      texte: DataTypes.TEXT,
      date: DataTypes.DATE,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
