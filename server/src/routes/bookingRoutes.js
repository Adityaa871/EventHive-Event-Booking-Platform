const { Router } = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  requestCancellation,
  requestReschedule,
  updateBookingStatus,
  reviewCancellation,
  reviewReschedule,
  downloadInvoice,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingStats,
} = require('../controllers/bookingController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

const router = Router();

// Rate limit public booking submissions
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
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

// 1. Analytics route (must be before /:id)
router.get('/stats/summary', protect, adminOnly, getBookingStats);

// 2. Customer user bookings
router.get('/my-bookings', protect, getMyBookings);

// 3. Public creation with optional logged-in user link
router.post('/', bookingLimiter, optionalAuth, bookingValidation, validate, createBooking);

// 4. Booking specific operations
router.get('/:id/invoice', protect, downloadInvoice);
router.post(
  '/:id/cancel-request',
  protect,
  [body('reason').notEmpty().trim().withMessage('Cancellation reason is required')],
  validate,
  requestCancellation
);
router.post(
  '/:id/reschedule-request',
  protect,
  [
    body('newDate').isISO8601().withMessage('Valid new event date required'),
    body('reason').optional().trim(),
  ],
  validate,
  requestReschedule
);

// 5. Admin management routes
router.get('/', protect, adminOnly, getBookings);
router.get('/:id', protect, getBooking);
router.patch('/:id', protect, adminOnly, updateBooking);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);
router.patch('/:id/cancellation-review', protect, adminOnly, reviewCancellation);
router.patch('/:id/reschedule-review', protect, adminOnly, reviewReschedule);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
