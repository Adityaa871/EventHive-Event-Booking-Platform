const { Router } = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getPackageReviews,
  updateReview,
  deleteReview,
  getAdminReviews,
  moderateReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = Router();

// Public
router.get('/package/:packageId', getPackageReviews);

// Protected (Customer)
router.post(
  '/',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().trim().withMessage('Comment is required'),
  ],
  validate,
  createReview
);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin moderation
router.get('/admin/list', protect, adminOnly, getAdminReviews);
router.patch('/:id/moderate', protect, adminOnly, moderateReview);

module.exports = router;
