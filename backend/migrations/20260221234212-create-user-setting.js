"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_settings", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // (works cross-db)
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      theme: {
        type: Sequelize.ENUM("light", "dark", "auto"),
        allowNull: false,
        defaultValue: "dark",
      },

      language: {
        type: Sequelize.ENUM("fr", "en", "es"),
        allowNull: false,
        defaultValue: "fr",
      },

      privacy: {
        type: Sequelize.ENUM("public", "friends", "private"),
        allowNull: false,
        defaultValue: "public",
      },

      sound: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      email_notifications: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      push_notifications: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      weekly_digest: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    // drop ENUM types (important in Postgres)
    await queryInterface.dropTable("user_settings");

    // In Postgres, Sequelize keeps enum types even after dropping tables
    // so we clean them manually:
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_settings_theme";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_settings_language";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_settings_privacy";',
    );
  },
};