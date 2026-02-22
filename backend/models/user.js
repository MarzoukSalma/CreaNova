"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Dream, { foreignKey: "userId", onDelete: "CASCADE" });
      User.belongsToMany(models.Inspiration, {
        through: models.Inspiration_utilisateur,
        foreignKey: "userId",
        otherKey: "inspiration_id",
      });
      User.hasMany(models.WorkSpace, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      nom: DataTypes.STRING,
      mail: DataTypes.STRING,
      motDePasse: DataTypes.STRING,
      avatarUrl: DataTypes.STRING, // ← Add this
      bio: DataTypes.TEXT, // ← Add this
      dateNaissance: DataTypes.DATE, // ← Add this
      phoneNumber: DataTypes.STRING, // ← Add this
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
