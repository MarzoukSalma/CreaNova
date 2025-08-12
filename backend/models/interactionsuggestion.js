'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InteractionSuggestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InteractionSuggestion.init({
    utilisateur_id: DataTypes.INTEGER,
    inspiration_id: DataTypes.INTEGER,
    important: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'InteractionSuggestion',
  });
  return InteractionSuggestion;
};