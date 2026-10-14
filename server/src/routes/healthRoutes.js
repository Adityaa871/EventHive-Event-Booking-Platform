const express = require('express');

const router = express.Router();

// @desc    Health check endpoint
// @route   GET /api/v1/health
// @access  Public
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    service: 'EventHive API',
    version: '1.0.0',
  });
});

module.exports = router;

