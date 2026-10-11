const { Router } = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingStats,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

const router = Router();

// Rate limit public booking submissions
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many booking requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const bookingValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit Indian mobile number required'),
  body('eventType')
    .isIn(['birthday', 'wedding', 'corporate', 'anniversary', 'other'])
    .withMessage('Invalid event type'),
  body('eventDate')
    .isISO8601()
    .withMessage('Valid date required')
    .custom((v) => {
      if (new Date(v) <= new Date()) throw new Error('Event date must be in the future');
      return true;
    }),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
];

// IMPORTANT: stats route must be defined before /:id to avoid conflict
router.get('/stats/summary', protect, getBookingStats);

// Public
router.post('/', bookingLimiter, bookingValidation, validate, createBooking);

// Admin
router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.patch('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;

