const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Helper to compute discount amount
 */
const calculateDiscount = (coupon, bookingAmount) => {
  if (!coupon || !coupon.isActive) return 0;
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return 0;
  if (coupon.minBookingAmount && bookingAmount < coupon.minBookingAmount) return 0;
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return 0;

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (bookingAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, bookingAmount);
  }

  return Math.round(discount * 100) / 100;
};

/**
 * @route   POST /api/v1/coupons/validate
 * @access  Public
 * @desc    Validate coupon code and return calculated discount and final price
 */
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, bookingAmount } = req.body;

  if (!code || bookingAmount === undefined) {
    throw new ApiError(400, 'Coupon code and booking amount are required');
  }

  const amount = Number(bookingAmount);
  if (isNaN(amount) || amount < 0) {
    throw new ApiError(400, 'Invalid booking amount');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

  if (!coupon || !coupon.isActive) {
    throw new ApiError(404, 'Invalid coupon code or coupon is inactive');
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    throw new ApiError(400, 'This coupon code has expired');
  }

  if (coupon.minBookingAmount && amount < coupon.minBookingAmount) {
    throw new ApiError(
      400,
      `This coupon requires a minimum booking amount of ₹${coupon.minBookingAmount.toLocaleString('en-IN')}`
    );
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new ApiError(400, 'This coupon has reached its maximum redemption limit');
  }

  const discount = calculateDiscount(coupon, amount);
  const finalAmount = Math.max(0, amount - discount);

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount,
      originalAmount: amount,
      finalAmount,
    },
    message: `Coupon "${coupon.code}" applied! You save ₹${discount.toLocaleString('en-IN')}.`,
  });
});

/**
 * @route   GET /api/v1/coupons
 * @access  Admin
 * @desc    List all coupons
 */
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt').lean();
  res.json({
    success: true,
    data: coupons,
  });
});

/**
 * @route   POST /api/v1/coupons
 * @access  Admin
 * @desc    Create a new coupon
 */
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minBookingAmount,
    maxDiscountAmount,
    expiryDate,
    usageLimit,
    description,
    isActive,
  } = req.body;

  const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (existing) {
    throw new ApiError(400, `Coupon with code "${code.toUpperCase()}" already exists`);
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    discountType,
    discountValue: Number(discountValue),
    minBookingAmount: minBookingAmount ? Number(minBookingAmount) : 0,
    maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
    expiryDate: new Date(expiryDate),
    usageLimit: usageLimit ? Number(usageLimit) : null,
    description: description?.trim() || '',
    isActive: isActive !== false,
  });

  res.status(201).json({
    success: true,
    data: coupon,
    message: 'Coupon created successfully',
  });
});

/**
 * @route   PATCH /api/v1/coupons/:id
 * @access  Admin
 * @desc    Update an existing coupon or toggle its active status
 */
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) throw new ApiError(404, 'Coupon not found');

  res.json({
    success: true,
    data: coupon,
    message: 'Coupon updated successfully',
  });
});

/**
 * @route   DELETE /api/v1/coupons/:id
 * @access  Admin
 * @desc    Delete a coupon
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');

  res.json({
    success: true,
    message: 'Coupon deleted successfully',
  });
});

module.exports = {
  calculateDiscount,
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
