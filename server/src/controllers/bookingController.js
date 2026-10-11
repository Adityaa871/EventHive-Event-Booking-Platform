const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   POST /api/v1/bookings
 * @access  Public
 * @desc    Submit a booking inquiry (creates a lead)
 */
const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body);
  await booking.populate('package', 'title category');
  res.status(201).json({
    success: true,
    data: booking,
    message: 'Booking request submitted successfully! We will contact you soon.',
  });
});

/**
 * @route   GET /api/v1/bookings
 * @access  Admin
 * @desc    List all leads with optional filters, search, pagination, sorting
 */
const getBookings = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('package', 'title category')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * @route   GET /api/v1/bookings/stats/summary
 * @access  Admin
 * @desc    Return counts per status for dashboard cards
 */
const getBookingStats = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const summary = { total: 0, new: 0, contacted: 0, confirmed: 0, cancelled: 0 };
  stats.forEach(({ _id, count }) => {
    summary[_id] = count;
    summary.total += count;
  });

  res.json({ success: true, data: summary });
});

/**
 * @route   GET /api/v1/bookings/:id
 * @access  Admin
 * @desc    Get a single booking / lead
 */
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('package', 'title category price');
  if (!booking) throw new ApiError(404, 'Booking not found');
  res.json({ success: true, data: booking });
});

/**
 * @route   PATCH /api/v1/bookings/:id
 * @access  Admin
 * @desc    Update booking status and/or admin notes
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const update = {};
  if (status) update.status = status;
  if (adminNotes !== undefined) update.adminNotes = adminNotes;

  const booking = await Booking.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).populate('package', 'title category');

  if (!booking) throw new ApiError(404, 'Booking not found');
  res.json({ success: true, data: booking, message: 'Booking updated successfully' });
});

/**
 * @route   DELETE /api/v1/bookings/:id
 * @access  Admin
 * @desc    Permanently delete a booking lead
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  res.json({ success: true, message: 'Booking deleted successfully' });
});

module.exports = { createBooking, getBookings, getBooking, updateBooking, deleteBooking, getBookingStats };

