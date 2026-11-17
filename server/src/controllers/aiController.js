const { getEventSuggestions } = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @route   POST /api/v1/ai/assistant
 * @access  Public
 * @desc    Chat with EventHive AI assistant for package recommendations & planning
 */
const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message, history, userPreferences } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError(400, 'Inquiry message is required');
  }

  const result = await getEventSuggestions({
    message: message.trim(),
    history: Array.isArray(history) ? history : [],
    userPreferences: userPreferences || {},
  });

  res.json({
    success: true,
    data: result,
  });
});

module.exports = { chatWithAssistant };
