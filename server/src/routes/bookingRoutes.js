const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingStatsSummary,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

const bookingValidation = [
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('eventType').trim().notEmpty().withMessage('Event type is required'),
  body('eventDate').isISO8601().toDate().withMessage('A valid event date is required'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

// Public lead submission
router.post('/', bookingValidation, validate, createBooking);

// Admin stats summary (Must be before /:id)
router.get('/stats/summary', protect, getBookingStatsSummary);

// Admin lead management
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;

