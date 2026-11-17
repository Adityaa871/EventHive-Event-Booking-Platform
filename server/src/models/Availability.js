const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    dateString: {
      type: String, // 'YYYY-MM-DD' for fast exact string queries
      required: true,
      index: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null, // null means global/venue-wide block
    },
    slot: {
      type: String,
      enum: ['full_day', 'morning', 'evening'],
      default: 'full_day',
    },
    reason: {
      type: String,
      trim: true,
      default: 'Reserved',
    },
    isBlocked: {
      type: Boolean,
      default: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index to prevent double bookings on the same date + package + slot
availabilitySchema.index({ dateString: 1, package: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
