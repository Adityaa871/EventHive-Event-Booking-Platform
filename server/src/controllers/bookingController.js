const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Availability = require('../models/Availability');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { calculateDiscount } = require('./couponController');
const { toDateString } = require('./availabilityController');
const {
  sendBookingSubmitted,
  sendBookingConfirmed,
  sendBookingCancelled,
  sendCancellationReviewed,
  sendRescheduleReviewed,
} = require('../services/emailService');
const { generateInvoicePDF } = require('../services/invoiceService');

// Valid status transitions
const VALID_TRANSITIONS = {
  new: ['pending', 'confirmed', 'cancelled'],
  contacted: ['pending', 'confirmed', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

/**
 * @route   POST /api/v1/bookings
 * @access  Public (Optional auth for linking to registered user)
 * @desc    Submit a booking request with double-booking prevention, coupon calculation, & email trigger
 */
const createBooking = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    package: packageId,
    eventType,
    eventDate,
    guestCount,
    venue,
    budget,
    message,
    couponCode,
  } = req.body;

  const dateObj = new Date(eventDate);
  if (isNaN(dateObj.getTime()) || dateObj <= new Date()) {
    throw new ApiError(400, 'Event date must be a valid future date');
  }

  const dateStr = toDateString(dateObj);

  // 1. Concurrency-safe availability check
  const blockedRecord = await Availability.findOne({
    dateString: dateStr,
    $or: [{ package: null }, ...(packageId ? [{ package: packageId }] : [])],
    isBlocked: true,
  });

  if (blockedRecord) {
    throw new ApiError(
      400,
      `The selected date (${dateStr}) is not available for booking: ${blockedRecord.reason || 'Reserved'}`
    );
  }

  // Check for any active booking on this date for the package
  const startOfDay = new Date(dateStr);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(dateStr);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const conflictQuery = {
    eventDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['confirmed', 'in_progress', 'pending', 'new', 'contacted'] },
  };
  if (packageId) conflictQuery.package = packageId;

  const existingBooking = await Booking.findOne(conflictQuery);
  if (existingBooking) {
    throw new ApiError(400, `The selected date (${dateStr}) is already reserved for this event category.`);
  }

  // 2. Fetch package if supplied
  let pkgDoc = null;
  let originalPrice = Number(budget) || 0;
  let packageName = 'Custom Event Service';

  if (packageId) {
    pkgDoc = await Package.findById(packageId);
    if (pkgDoc) {
      originalPrice = pkgDoc.price;
      packageName = pkgDoc.title;
    }
  }

  // 3. Coupon validation & discount computation
  let discountAmount = 0;
  let appliedCouponCode = null;

  if (couponCode && couponCode.trim()) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase().trim(),
      isActive: true,
    });
    if (coupon) {
      discountAmount = calculateDiscount(coupon, originalPrice);
      if (discountAmount > 0) {
        appliedCouponCode = coupon.code;
        // Increment usage count atomically
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usageCount: 1 } });
      }
    }
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);

  // 4. Create booking
  const bookingData = {
    user: req.user ? req.user._id : null,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    package: packageId || null,
    packageName,
    eventType,
    eventDate: dateObj,
    guestCount: Number(guestCount),
    venue: venue ? venue.trim() : '',
    budget: originalPrice,
    message: message ? message.trim() : '',
    status: 'pending',
    priceDetails: {
      originalPrice,
      discountAmount,
      finalPrice,
      couponCode: appliedCouponCode,
    },
    history: [
      {
        status: 'pending',
        updatedBy: req.user ? 'client' : 'guest',
        note: 'Booking request created.',
        timestamp: new Date(),
      },
    ],
  };

  const booking = await Booking.create(bookingData);

  // 5. Reserve date in Availability
  try {
    await Availability.create({
      date: dateObj,
      dateString: dateStr,
      package: packageId || null,
      slot: 'full_day',
      reason: `Reserved for Booking #${booking._id.toString().slice(-6).toUpperCase()}`,
      isBlocked: true,
      booking: booking._id,
      blockedBy: req.user ? req.user._id : null,
    });
  } catch (err) {
    // If availability insert hits duplicate index, another booking reserved the slot
    if (err.code === 11000) {
      await Booking.findByIdAndDelete(booking._id);
      throw new ApiError(409, 'Slot was just claimed by another reservation. Please select another date.');
    }
    console.error('Availability lock error:', err.message);
  }

  await booking.populate('package', 'title category price inclusions images');

  // 6. Asynchronous email notification (never blocks response)
  sendBookingSubmitted(booking).catch(() => {});

  res.status(201).json({
    success: true,
    data: booking,
    message: 'Booking request submitted successfully! We will contact you soon.',
  });
});

/**
 * @route   GET /api/v1/bookings/my-bookings
 * @access  Protected (User)
 * @desc    Get user's previous and upcoming bookings
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const query = {
    $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }],
  };

  const bookings = await Booking.find(query)
    .populate('package', 'title category price images shortDescription')
    .sort('-eventDate')
    .lean();

  const now = new Date();
  const upcoming = [];
  const past = [];

  bookings.forEach((b) => {
    if (new Date(b.eventDate) >= now && !['completed', 'cancelled'].includes(b.status)) {
      upcoming.push(b);
    } else {
      past.push(b);
    }
  });

  res.json({
    success: true,
    data: {
      all: bookings,
      upcoming,
      past,
      total: bookings.length,
    },
  });
});

/**
 * @route   POST /api/v1/bookings/:id/cancel-request
 * @access  Protected (User)
 * @desc    Customer submits a request to cancel a booking
 */
const requestCancellation = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason || !reason.trim()) {
    throw new ApiError(400, 'Cancellation reason is required');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // Verify ownership
  const isOwner =
    (booking.user && booking.user.toString() === req.user._id.toString()) ||
    booking.email.toLowerCase() === req.user.email.toLowerCase();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to modify this booking');
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    throw new ApiError(400, `Cannot request cancellation for a ${booking.status} booking`);
  }

  booking.cancellationRequest = {
    requested: true,
    reason: reason.trim(),
    requestedAt: new Date(),
    status: 'pending',
    adminResponse: '',
  };

  booking.history.push({
    status: booking.status,
    updatedBy: 'client',
    note: `Cancellation requested: "${reason.trim()}"`,
    timestamp: new Date(),
  });

  await booking.save();

  res.json({
    success: true,
    data: booking,
    message: 'Cancellation request submitted for administrative review.',
  });
});

/**
 * @route   POST /api/v1/bookings/:id/reschedule-request
 * @access  Protected (User)
 * @desc    Customer requests to reschedule their booking date
 */
const requestReschedule = asyncHandler(async (req, res) => {
  const { newDate, reason } = req.body;

  if (!newDate) throw new ApiError(400, 'New proposed event date is required');

  const newDateObj = new Date(newDate);
  if (isNaN(newDateObj.getTime()) || newDateObj <= new Date()) {
    throw new ApiError(400, 'New proposed date must be in the future');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner =
    (booking.user && booking.user.toString() === req.user._id.toString()) ||
    booking.email.toLowerCase() === req.user.email.toLowerCase();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to modify this booking');
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    throw new ApiError(400, `Cannot request reschedule for a ${booking.status} booking`);
  }

  // Validate that the new date is currently available
  const newDateStr = toDateString(newDateObj);
  const conflict = await Availability.findOne({
    dateString: newDateStr,
    $or: [{ package: null }, ...(booking.package ? [{ package: booking.package }] : [])],
    isBlocked: true,
  });

  if (conflict) {
    throw new ApiError(400, `The proposed date (${newDateStr}) is not available.`);
  }

  booking.rescheduleRequest = {
    requested: true,
    newDate: newDateObj,
    reason: reason ? reason.trim() : 'Date adjustment requested by client',
    requestedAt: new Date(),
    status: 'pending',
    adminResponse: '',
  };

  booking.history.push({
    status: booking.status,
    updatedBy: 'client',
    note: `Reschedule requested for ${newDateStr}: "${reason || 'Client request'}"`,
    timestamp: new Date(),
  });

  await booking.save();

  res.json({
    success: true,
    data: booking,
    message: 'Reschedule request submitted for administrative review.',
  });
});

/**
 * @route   PATCH /api/v1/bookings/:id/status
 * @access  Admin
 * @desc    Admin manually updates booking status with transition validation
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, note, adminNotes } = req.body;
  const booking = await Booking.findById(req.params.id).populate('package', 'title category price');

  if (!booking) throw new ApiError(404, 'Booking not found');

  if (status && status !== booking.status) {
    const allowed = VALID_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status transition from "${booking.status}" to "${status}". Allowed transitions: ${allowed.join(', ') || 'None'}`
      );
    }

    const previousStatus = booking.status;
    booking.status = status;

    booking.history.push({
      status,
      updatedBy: req.user ? req.user.name : 'admin',
      note: note || `Status transitioned from ${previousStatus} to ${status}`,
      timestamp: new Date(),
    });

    // If confirmed, trigger confirmation email
    if (status === 'confirmed') {
      sendBookingConfirmed(booking).catch(() => {});
    }

    // If cancelled, free availability lock and send cancellation email
    if (status === 'cancelled') {
      await Availability.deleteMany({ booking: booking._id });
      sendBookingCancelled(booking, note || 'Cancelled by administration').catch(() => {});
    }
  }

  if (adminNotes !== undefined) {
    booking.adminNotes = adminNotes;
  }

  await booking.save();

  res.json({
    success: true,
    data: booking,
    message: `Booking status updated to ${booking.status}`,
  });
});

/**
 * @route   PATCH /api/v1/bookings/:id/cancellation-review
 * @access  Admin
 * @desc    Approve or reject a customer's cancellation request
 */
const reviewCancellation = asyncHandler(async (req, res) => {
  const { approved, adminResponse } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (!booking.cancellationRequest?.requested) {
    throw new ApiError(400, 'No active cancellation request on this booking');
  }

  booking.cancellationRequest.status = approved ? 'approved' : 'rejected';
  booking.cancellationRequest.adminResponse = adminResponse?.trim() || '';
  booking.cancellationRequest.reviewedAt = new Date();

  if (approved) {
    booking.status = 'cancelled';
    await Availability.deleteMany({ booking: booking._id });
  }

  booking.history.push({
    status: booking.status,
    updatedBy: 'admin',
    note: `Cancellation request ${approved ? 'approved' : 'rejected'}: "${adminResponse || ''}"`,
    timestamp: new Date(),
  });

  await booking.save();

  sendCancellationReviewed(booking, approved, adminResponse).catch(() => {});

  res.json({
    success: true,
    data: booking,
    message: `Cancellation request ${approved ? 'approved' : 'rejected'}.`,
  });
});

/**
 * @route   PATCH /api/v1/bookings/:id/reschedule-review
 * @access  Admin
 * @desc    Approve or reject a customer's reschedule request
 */
const reviewReschedule = asyncHandler(async (req, res) => {
  const { approved, adminResponse } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (!booking.rescheduleRequest?.requested || !booking.rescheduleRequest?.newDate) {
    throw new ApiError(400, 'No active reschedule request on this booking');
  }

  booking.rescheduleRequest.status = approved ? 'approved' : 'rejected';
  booking.rescheduleRequest.adminResponse = adminResponse?.trim() || '';
  booking.rescheduleRequest.reviewedAt = new Date();

  const newDate = booking.rescheduleRequest.newDate;

  if (approved) {
    const oldDateStr = toDateString(booking.eventDate);
    const newDateStr = toDateString(newDate);

    // Free old date and lock new date
    await Availability.deleteMany({ booking: booking._id });
    await Availability.create({
      date: newDate,
      dateString: newDateStr,
      package: booking.package || null,
      slot: 'full_day',
      reason: `Rescheduled Booking #${booking._id.toString().slice(-6).toUpperCase()}`,
      isBlocked: true,
      booking: booking._id,
      blockedBy: req.user._id,
    });

    booking.eventDate = newDate;
  }

  booking.history.push({
    status: booking.status,
    updatedBy: 'admin',
    note: `Reschedule request ${approved ? 'approved' : 'rejected'}: "${adminResponse || ''}"`,
    timestamp: new Date(),
  });

  await booking.save();

  sendRescheduleReviewed(booking, approved, newDate, adminResponse).catch(() => {});

  res.json({
    success: true,
    data: booking,
    message: `Reschedule request ${approved ? 'approved' : 'rejected'}.`,
  });
});

/**
 * @route   GET /api/v1/bookings/:id/invoice
 * @access  Protected (User owner or Admin)
 * @desc    Generate and download booking PDF invoice
 */
const downloadInvoice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('package', 'title category price inclusions');

  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner =
    (booking.user && booking.user.toString() === req.user._id.toString()) ||
    booking.email.toLowerCase() === req.user.email.toLowerCase();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to download this invoice');
  }

  const pdfBuffer = await generateInvoicePDF(booking);

  const filename = `EventHive-Invoice-${booking.invoiceNumber || booking._id.toString().slice(-6).toUpperCase()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  res.send(pdfBuffer);
});

/**
 * @route   GET /api/v1/bookings
 * @access  Admin
 * @desc    List all bookings with rich filtering, search, pagination, and category filters
 */
const getBookings = asyncHandler(async (req, res) => {
  const {
    status,
    search,
    eventType,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    sort = '-createdAt',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (eventType) filter.eventType = eventType;

  if (startDate || endDate) {
    filter.eventDate = {};
    if (startDate) filter.eventDate.$gte = new Date(startDate);
    if (endDate) filter.eventDate.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { packageName: { $regex: search, $options: 'i' } },
      { invoiceNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('package', 'title category price images')
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
 * @desc    Comprehensive dashboard analytics calculated from actual database records
 */
const getBookingStats = asyncHandler(async (req, res) => {
  // Status breakdown
  const statusCounts = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const summary = {
    total: 0,
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  };

  statusCounts.forEach(({ _id, count }) => {
    // Map legacy 'new' & 'contacted' to pending for summary consistency
    if (_id === 'new' || _id === 'contacted') {
      summary.pending += count;
    } else if (summary[_id] !== undefined) {
      summary[_id] = count;
    }
    summary.total += count;
  });

  // Total registered users
  const totalUsers = await User.countDocuments({ role: 'user' });

  // Total booking value/revenue from recorded confirmed, in_progress, and completed bookings
  const revenueAgg = await Booking.aggregate([
    {
      $match: {
        status: { $in: ['confirmed', 'in_progress', 'completed'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $ifNull: ['$priceDetails.finalPrice', { $ifNull: ['$budget', 0] }],
          },
        },
      },
    },
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // Most popular packages
  const popularPackages = await Booking.aggregate([
    { $match: { package: { $ne: null } } },
    { $group: { _id: '$package', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'packages',
        localField: '_id',
        foreignField: '_id',
        as: 'pkg',
      },
    },
    { $unwind: '$pkg' },
    {
      $project: {
        _id: '$pkg._id',
        title: '$pkg.title',
        category: '$pkg.category',
        price: '$pkg.price',
        bookingCount: '$count',
      },
    },
  ]);

  // Monthly stats over the past 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyAgg = await Booking.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        bookingsCount: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [
              { $in: ['$status', ['confirmed', 'in_progress', 'completed']] },
              { $ifNull: ['$priceDetails.finalPrice', { $ifNull: ['$budget', 0] }] },
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Recent 5 bookings
  const recentBookings = await Booking.find()
    .populate('package', 'title category price')
    .sort('-createdAt')
    .limit(5)
    .lean();

  res.json({
    success: true,
    data: {
      summary,
      totalUsers,
      totalRevenue,
      popularPackages,
      monthlyStats: monthlyAgg,
      recentBookings,
      statusDistribution: statusCounts.map((s) => ({
        status: s._id,
        count: s.count,
      })),
    },
  });
});

/**
 * @route   GET /api/v1/bookings/:id
 * @access  Protected (User owner or Admin)
 * @desc    Get a single booking with package and timeline
 */
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('package', 'title category price images duration inclusions');
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner =
    req.user &&
    ((booking.user && booking.user.toString() === req.user._id.toString()) ||
      booking.email.toLowerCase() === req.user.email.toLowerCase());

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this booking');
  }

  res.json({ success: true, data: booking });
});

/**
 * @route   PATCH /api/v1/bookings/:id
 * @access  Admin
 * @desc    Update booking fields (legacy helper wrapper)
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
 * @desc    Permanently delete a booking lead and its availability lock
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  await Availability.deleteMany({ booking: req.params.id });

  res.json({ success: true, message: 'Booking deleted successfully' });
});

module.exports = {
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
};
