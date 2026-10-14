const Booking = require('../models/Booking');
const Package = require('../models/Package');

// @desc    Submit a booking inquiry
// @route   POST /api/v1/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const {
      clientName,
      email,
      phone,
      package: packageId,
      packageName,
      eventType,
      eventDate,
      guestCount,
      location,
      notes,
    } = req.body;

    let resolvedPackageName = packageName;
    if (packageId) {
      const foundPkg = await Package.findById(packageId);
      if (foundPkg) {
        resolvedPackageName = foundPkg.name;
      }
    }

    const booking = await Booking.create({
      clientName,
      email,
      phone,
      package: packageId || undefined,
      packageName: resolvedPackageName || 'Custom Event Package',
      eventType,
      eventDate,
      guestCount: Number(guestCount),
      location,
      notes: notes || '',
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Booking inquiry submitted successfully! Our event planning team will contact you shortly.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings/leads
// @route   GET /api/v1/bookings
// @access  Private (Admin)
const getBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15, sort = '-createdAt' } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { clientName: regex },
        { email: regex },
        { phone: regex },
        { location: regex },
        { eventType: regex },
        { packageName: regex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('package', 'name category price duration')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking/lead by ID
// @route   GET /api/v1/bookings/:id
// @access  Private (Admin)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'package',
      'name category price duration capacity image inclusions'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking inquiry not found',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status or internal notes
// @route   PATCH /api/v1/bookings/:id
// @access  Private (Admin)
const updateBooking = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking inquiry not found',
      });
    }

    if (status) {
      const allowedStatuses = ['new', 'contacted', 'confirmed', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
        });
      }
      booking.status = status;
    }

    if (internalNotes !== undefined) {
      booking.internalNotes = internalNotes;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking inquiry
// @route   DELETE /api/v1/bookings/:id
// @access  Private (Admin)
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking inquiry not found',
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Booking inquiry deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking lead counts and summary stats
// @route   GET /api/v1/bookings/stats/summary
// @access  Private (Admin)
const getBookingStatsSummary = async (req, res, next) => {
  try {
    const [statusCounts, totalBookings, totalPackages, recentBookings] = await Promise.all([
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Booking.countDocuments(),
      Package.countDocuments({ isActive: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const stats = {
      new: 0,
      contacted: 0,
      confirmed: 0,
      cancelled: 0,
      totalLeads: totalBookings,
      totalPackages,
    };

    statusCounts.forEach((item) => {
      if (stats[item._id] !== undefined) {
        stats[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      stats,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingStatsSummary,
};

