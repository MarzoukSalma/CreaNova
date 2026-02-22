"use strict";

const { UserSetting } = require("../models");

const allowedTheme = ["light", "dark", "auto"];
const allowedLang = ["fr", "en", "es"];
const allowedPrivacy = ["public", "friends", "private"];

exports.getMySettings = async (req, res) => {
  try {
    const [settings] = await UserSetting.findOrCreate({
      where: { userId: req.user.id },
      defaults: { userId: req.user.id },
    });

    return res.json({ settings });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateMySettings = async (req, res) => {
  try {
    const payload = req.body || {};

    if (payload.theme && !allowedTheme.includes(payload.theme))
      return res.status(400).json({ message: "theme invalide" });

    if (payload.language && !allowedLang.includes(payload.language))
      return res.status(400).json({ message: "language invalide" });

    if (payload.privacy && !allowedPrivacy.includes(payload.privacy))
      return res.status(400).json({ message: "privacy invalide" });

    const [settings] = await UserSetting.findOrCreate({
      where: { userId: req.user.id },
      defaults: { userId: req.user.id },
    });

    await settings.update({
      theme: payload.theme ?? settings.theme,
      language: payload.language ?? settings.language,
      privacy: payload.privacy ?? settings.privacy,
      sound: payload.sound ?? settings.sound,
      emailNotifications: payload.emailNotifications ?? settings.emailNotifications,
      pushNotifications: payload.pushNotifications ?? settings.pushNotifications,
      weeklyDigest: payload.weeklyDigest ?? settings.weeklyDigest,
    });

    return res.json({ message: "Paramètres mis à jour", settings });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};