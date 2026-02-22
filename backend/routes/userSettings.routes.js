"use strict";

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth.js");
const ctrl = require("../controllers/userSettings.controller");

router.get("/profile/settings", authenticateToken, ctrl.getMySettings);
router.put("/profile/settings", authenticateToken, ctrl.updateMySettings);

module.exports = router;