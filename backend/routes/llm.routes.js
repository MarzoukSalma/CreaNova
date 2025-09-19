// routes/llm.routes.js
const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/llmController');

// Route POST /api/chat
router.post('/chat', processChat);

module.exports = router;