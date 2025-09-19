"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkSpace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkSpace.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  WorkSpace.init(
    {
      titre: DataTypes.STRING,
      description: DataTypes.TEXT,
      dateCreation: DataTypes.DATE,
      userId: DataTypes.INTEGER,
      accorder: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "WorkSpace",
    }
  );
  return WorkSpace;
};
