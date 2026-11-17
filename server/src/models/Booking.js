const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null,
      index: true,
    },
    packageName: {
      type: String,
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['birthday', 'wedding', 'corporate', 'anniversary', 'other'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
    },
    venue: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'new', 'contacted'],
      default: 'pending',
      index: true,
    },
    // Pricing & Coupon
    priceDetails: {
      originalPrice: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      finalPrice: { type: Number, default: 0 },
      couponCode: { type: String, default: null },
    },
    // Cancellation request workflow
    cancellationRequest: {
      requested: { type: Boolean, default: false },
      reason: { type: String, trim: true },
      requestedAt: { type: Date },
      status: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
      },
      adminResponse: { type: String, trim: true },
      reviewedAt: { type: Date },
    },
    // Reschedule request workflow
    rescheduleRequest: {
      requested: { type: Boolean, default: false },
      newDate: { type: Date },
      reason: { type: String, trim: true },
      requestedAt: { type: Date },
      status: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
      },
      adminResponse: { type: String, trim: true },
      reviewedAt: { type: Date },
    },
    // Status history audit trail
    history: [
      {
        status: { type: String, required: true },
        updatedBy: { type: String, default: 'system' }, // 'client', 'admin', 'system'
        note: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    // Invoice tracking
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    invoiceIssuedAt: {
      type: Date,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number before save if status is confirmed/completed and none exists
bookingSchema.pre('save', function (next) {
  if (['confirmed', 'in_progress', 'completed'].includes(this.status) && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.invoiceNumber = `INV-${year}-${randomHex}`;
    this.invoiceIssuedAt = this.invoiceIssuedAt || new Date();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
