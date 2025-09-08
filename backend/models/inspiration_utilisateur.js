'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inspiration_utilisateur extends Model {
   
    static associate(models) {
      // define association here
    }
  }
  Inspiration_utilisateur.init({
  inspiration_id: DataTypes.INTEGER,
  userId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Inspiration_utilisateur',
});

  return Inspiration_utilisateur;
};