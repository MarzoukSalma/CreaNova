"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inspiration extends Model {
    static associate(models) {
      Inspiration.belongsToMany(models.User, {
        through: models.Inspiration_utilisateur, // même table pivot
        foreignKey: "inspiration_id",
        otherKey: "userId",
      });
    }
  }
  Inspiration.init(
    {
      contenu: DataTypes.TEXT,
      date: DataTypes.DATE,
      mood: DataTypes.STRING,
      createur: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Inspiration",
    }
  );
  return Inspiration;
};
