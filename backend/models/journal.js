"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
   
    static associate(models) {
      // define association here
    }
  }
  Journal.init(
    {
      mood: DataTypes.TEXT,
      texte: DataTypes.TEXT,
      date: DataTypes.DATE,
      utilisateur_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
