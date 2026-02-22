"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserSetting = sequelize.define(
    "UserSetting",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: "user_id",
      },

      theme: {
        type: DataTypes.ENUM("light", "dark", "auto"),
        allowNull: false,
        defaultValue: "dark",
      },

      language: {
        type: DataTypes.ENUM("fr", "en", "es"),
        allowNull: false,
        defaultValue: "fr",
      },

      privacy: {
        type: DataTypes.ENUM("public", "friends", "private"),
        allowNull: false,
        defaultValue: "public",
      },

      sound: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      emailNotifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "email_notifications",
      },

      pushNotifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "push_notifications",
      },

      weeklyDigest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "weekly_digest",
      },
    },
    {
      tableName: "user_settings",
      underscored: true,
    },
  );

  UserSetting.associate = (models) => {
    // 1 user -> 1 settings
    UserSetting.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return UserSetting;
};