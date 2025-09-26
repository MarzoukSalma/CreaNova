// controllers/llmController.js
const llmHelper = require('../services/llm/llmHelper');

const processChat = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'userId et message sont requis'
      });
    }

    const result = await llmHelper.processMessage(userId, message);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in processChat:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  processChat
};