const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: false,
    },
    packageName: {
      type: String,
      default: 'Custom Event Inquiry',
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Estimated guest count is required'],
      min: [1, 'Guest count must be at least 1'],
    },
    location: {
      type: String,
      required: [true, 'Event location or city is required'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'cancelled'],
      default: 'new',
    },
    internalNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ clientName: 'text', email: 'text', phone: 'text' });
bookingSchema.index({ status: 1, eventDate: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

