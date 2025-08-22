'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Journals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mood: {
        type: Sequelize.TEXT
      },
      texte: {
        type: Sequelize.TEXT
      },
      date: {
        type: Sequelize.DATEONLY, // <--- ici: DATE sans heure
        allowNull: false     
       },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // NOM exact de la table cible
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Journals');
  }
};
