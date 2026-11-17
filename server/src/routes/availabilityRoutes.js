const { Router } = require('express');
const {
  checkAvailability,
  getMonthAvailability,
  blockDate,
  unblockDate,
  getBlockedDates,
} = require('../controllers/availabilityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = Router();

// Public
router.get('/check', checkAvailability);
router.get('/month', getMonthAvailability);

// Admin-only
router.get('/admin-list', protect, adminOnly, getBlockedDates);
router.post('/block', protect, adminOnly, blockDate);
router.delete('/unblock/:id', protect, adminOnly, unblockDate);

module.exports = router;
