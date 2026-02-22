'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Journal.init({
    mood: DataTypes.TEXT,
    texte: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Journal',
  });
  return Journal;
};