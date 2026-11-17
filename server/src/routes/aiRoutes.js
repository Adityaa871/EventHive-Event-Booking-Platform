const { Router } = require('express');
const { chatWithAssistant } = require('../controllers/aiController');
const rateLimit = require('express-rate-limit');

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 queries per minute per IP
  message: { success: false, message: 'AI concierge is busy, please try again in a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/assistant', aiLimiter, chatWithAssistant);

module.exports = router;
