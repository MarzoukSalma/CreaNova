"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inspiration extends Model {
   
    static associate(models) {
      Inspiration.belongsToMany(models.User, {
      through: "UserInspiration", // même table pivot
      foreignKey: "inspirationId",
      otherKey: "userId",
    });
    }
  }
  Inspiration.init(
    {
      contenu: DataTypes.TEXT,
      date: DataTypes.DATE,
      mood: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Inspiration",
    }
  );
  return Inspiration;
};
