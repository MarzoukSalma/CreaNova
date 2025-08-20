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
      utilisateur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Utilisateurs', // NOM exact de la table cible
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

       await queryInterface.addConstraint("Journals", {
      fields: ["userId", "date"],
      type: "unique",
      name: "unique_journal_per_day"
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Journals');
  }
};
