'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reve extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reve.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_creation: DataTypes.DATE,
    statut: DataTypes.STRING,
    priorite: DataTypes.STRING,
    utilisateur_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reve',
  });
  return Reve;
};