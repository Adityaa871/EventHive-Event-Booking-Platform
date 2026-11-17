const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Normalizes any Date or ISO string into 'YYYY-MM-DD'
 */
const toDateString = (dateInput) => {
  const d = new Date(dateInput);
  return d.toISOString().split('T')[0];
};

/**
 * @route   GET /api/v1/availability/check
 * @access  Public
 * @desc    Check whether a specific date & package is available
 */
const checkAvailability = asyncHandler(async (req, res) => {
  const { date, packageId, slot = 'full_day' } = req.query;

  if (!date) {
    throw new ApiError(400, 'Date query parameter is required (YYYY-MM-DD)');
  }

  const dateStr = toDateString(date);

  // 1. Check if an admin blocked this date (global block or package-specific)
  const blockedRecord = await Availability.findOne({
    dateString: dateStr,
    slot,
    $or: [{ package: null }, { package: packageId || null }],
    isBlocked: true,
  });

  if (blockedRecord) {
    return res.json({
      success: true,
      available: false,
      reason: blockedRecord.reason || 'This date is reserved/blocked by administration.',
    });
  }

  // 2. Check if an active booking already claims this date for the given package or global slot
  const startOfDay = new Date(dateStr);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(dateStr);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const existingBookingQuery = {
    eventDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['confirmed', 'in_progress', 'pending'] },
  };

  if (packageId) {
    existingBookingQuery.package = packageId;
  }

  const existingBooking = await Booking.findOne(existingBookingQuery);

  if (existingBooking) {
    return res.json({
      success: true,
      available: false,
      reason: 'This date slot is already scheduled for an ongoing booking.',
    });
  }

  res.json({
    success: true,
    available: true,
    message: 'Date is available for booking',
  });
});

/**
 * @route   GET /api/v1/availability/month
 * @access  Public
 * @desc    Get all booked/blocked dates for a given month (e.g. year=2026, month=11)
 */
const getMonthAvailability = asyncHandler(async (req, res) => {
  const { year, month, packageId } = req.query;

  if (!year || !month) {
    throw new ApiError(400, 'Year and month query parameters are required');
  }

  const y = parseInt(year, 10);
  const m = parseInt(month, 10); // 1-12

  const startOfMonth = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

  // Query blocked dates in Availability collection
  const blockedRecords = await Availability.find({
    date: { $gte: startOfMonth, $lte: endOfMonth },
    isBlocked: true,
    $or: [{ package: null }, ...(packageId ? [{ package: packageId }] : [])],
  }).lean();

  // Query booked dates from confirmed/pending Bookings
  const bookingQuery = {
    eventDate: { $gte: startOfMonth, $lte: endOfMonth },
    status: { $in: ['confirmed', 'in_progress', 'pending'] },
  };
  if (packageId) {
    bookingQuery.package = packageId;
  }

  const bookings = await Booking.find(bookingQuery)
    .select('eventDate status eventType package')
    .lean();

  const unavailableDates = new Set();
  const dateDetails = {};

  blockedRecords.forEach((b) => {
    unavailableDates.add(b.dateString);
    dateDetails[b.dateString] = {
      type: 'blocked',
      reason: b.reason || 'Blocked',
    };
  });

  bookings.forEach((bk) => {
    const ds = toDateString(bk.eventDate);
    unavailableDates.add(ds);
    dateDetails[ds] = {
      type: 'booked',
      reason: `Booked (${bk.status})`,
    };
  });

  res.json({
    success: true,
    data: {
      unavailableDates: Array.from(unavailableDates),
      dateDetails,
    },
  });
});

/**
 * @route   POST /api/v1/availability/block
 * @access  Admin
 * @desc    Manually block a date or date range
 */
const blockDate = asyncHandler(async (req, res) => {
  const { date, packageId = null, slot = 'full_day', reason = 'Reserved by Management' } = req.body;

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  const dateObj = new Date(date);
  const dateString = toDateString(dateObj);

  const availability = await Availability.findOneAndUpdate(
    { dateString, package: packageId || null, slot },
    {
      date: dateObj,
      dateString,
      package: packageId || null,
      slot,
      reason,
      isBlocked: true,
      blockedBy: req.user._id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({
    success: true,
    data: availability,
    message: `Date ${dateString} has been blocked successfully.`,
  });
});

/**
 * @route   DELETE /api/v1/availability/unblock/:id
 * @access  Admin
 * @desc    Unblock a previously blocked date record
 */
const unblockDate = asyncHandler(async (req, res) => {
  const record = await Availability.findByIdAndDelete(req.params.id);
  if (!record) {
    throw new ApiError(404, 'Blocked date record not found');
  }

  res.json({
    success: true,
    message: `Date ${record.dateString} has been unblocked.`,
  });
});

/**
 * @route   GET /api/v1/availability/admin-list
 * @access  Admin
 * @desc    List all manually blocked dates
 */
const getBlockedDates = asyncHandler(async (req, res) => {
  const records = await Availability.find({ isBlocked: true })
    .populate('package', 'title')
    .sort('date')
    .lean();

  res.json({
    success: true,
    data: records,
  });
});

module.exports = {
  checkAvailability,
  getMonthAvailability,
  blockDate,
  unblockDate,
  getBlockedDates,
  toDateString,
};
