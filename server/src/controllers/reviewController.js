const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   POST /api/v1/reviews
 * @access  Protected (User)
 * @desc    Submit a review for a completed booking
 */
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating || !comment) {
    throw new ApiError(400, 'Booking ID, star rating (1-5), and feedback comment are required');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Verify booking belongs to user
  const isOwner =
    (booking.user && booking.user.toString() === req.user._id.toString()) ||
    booking.email.toLowerCase() === req.user.email.toLowerCase();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only review bookings associated with your account');
  }

  // Verify booking is completed
  if (booking.status !== 'completed') {
    throw new ApiError(400, 'Reviews can only be submitted after an event is marked as completed');
  }

  // Prevent duplicate reviews
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    throw new ApiError(400, 'You have already submitted a review for this event booking');
  }

  const review = await Review.create({
    booking: booking._id,
    user: req.user._id,
    package: booking.package,
    userName: req.user.name,
    rating: Number(rating),
    comment: comment.trim(),
    isApproved: true,
  });

  res.status(201).json({
    success: true,
    data: review,
    message: 'Thank you for your feedback! Review published.',
  });
});

/**
 * @route   GET /api/v1/reviews/package/:packageId
 * @access  Public
 * @desc    Get all approved reviews for a package
 */
const getPackageReviews = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  const reviews = await Review.find({ package: packageId, isApproved: true })
    .sort('-createdAt')
    .lean();

  res.json({
    success: true,
    data: reviews,
  });
});

/**
 * @route   PATCH /api/v1/reviews/:id
 * @access  Protected (User owner)
 * @desc    Edit user's own review
 */
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to edit this review');
  }

  if (rating !== undefined) review.rating = Number(rating);
  if (comment !== undefined) review.comment = comment.trim();

  await review.save();

  res.json({
    success: true,
    data: review,
    message: 'Review updated successfully',
  });
});

/**
 * @route   DELETE /api/v1/reviews/:id
 * @access  Protected (User owner or Admin)
 * @desc    Delete a review
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  await Review.findOneAndDelete({ _id: req.params.id });

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

/**
 * @route   GET /api/v1/reviews/admin-list
 * @access  Admin
 * @desc    List all reviews with moderation controls
 */
const getAdminReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('package', 'title')
    .sort('-createdAt')
    .lean();

  res.json({
    success: true,
    data: reviews,
  });
});

/**
 * @route   PATCH /api/v1/reviews/:id/moderate
 * @access  Admin
 * @desc    Toggle review approval
 */
const moderateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.isApproved = !review.isApproved;
  await review.save();

  res.json({
    success: true,
    data: review,
    message: `Review has been ${review.isApproved ? 'approved' : 'hidden'}`,
  });
});

module.exports = {
  createReview,
  getPackageReviews,
  updateReview,
  deleteReview,
  getAdminReviews,
  moderateReview,
};
