const { Router } = require('express');
const { body } = require('express-validator');
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = Router();

// Public validation endpoint for bookings
router.post(
  '/validate',
  [
    body('code').notEmpty().trim().withMessage('Coupon code is required'),
    body('bookingAmount').isNumeric().withMessage('Booking amount must be a number'),
  ],
  validate,
  validateCoupon
);

// Admin endpoints
router.get('/', protect, adminOnly, getCoupons);
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('code').notEmpty().trim().withMessage('Code is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isFloat({ min: 1 }).withMessage('Discount value must be at least 1'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date required'),
  ],
  validate,
  createCoupon
);
router.patch('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
