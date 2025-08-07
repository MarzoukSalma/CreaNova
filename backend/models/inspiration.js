'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inspiration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inspiration.init({
    type: DataTypes.STRING,
    contenu: DataTypes.TEXT,
    tags: DataTypes.TEXT,
    date: DataTypes.DATE,
    utilisateur_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Inspiration',
  });
  return Inspiration;
};