const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
      maxlength: [100, 'Package name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Weddings',
        'Birthdays',
        'Corporate Events',
        'Anniversaries',
        'Concerts & Galas',
        'Social Gatherings',
      ],
      default: 'Weddings',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required (e.g., 4 Hours, Full Day)'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Guest capacity is required'],
      min: [1, 'Capacity must be at least 1 guest'],
    },
    description: {
      type: String,
      required: [true, 'Package description is required'],
      trim: true,
    },
    inclusions: {
      type: [String],
      required: [true, 'At least one inclusion is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A package must have at least one inclusion',
      },
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search by name and description
packageSchema.index({ name: 'text', description: 'text' });
packageSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Package', packageSchema);

