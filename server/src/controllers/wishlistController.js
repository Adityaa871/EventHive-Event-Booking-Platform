const User = require('../models/User');
const Package = require('../models/Package');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/wishlist
 * @access  Protected (User)
 * @desc    Get current user's saved wishlist packages
 */
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'wishlist',
      select: 'title slug category price capacity duration shortDescription images isFeatured averageRating reviewCount',
    })
    .lean();

  if (!user) throw new ApiError(404, 'User not found');

  res.json({
    success: true,
    data: user.wishlist || [],
  });
});

/**
 * @route   POST /api/v1/wishlist/:packageId
 * @access  Protected (User)
 * @desc    Add a package to user's wishlist (prevents duplicate)
 */
const addToWishlist = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  const pkg = await Package.findById(packageId);
  if (!pkg) throw new ApiError(404, 'Package not found');

  // $addToSet prevents duplicates atomically
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: packageId } },
    { new: true }
  ).populate('wishlist', 'title price slug category images');

  res.json({
    success: true,
    data: user.wishlist,
    message: `"${pkg.title}" added to your saved wishlist`,
  });
});

/**
 * @route   DELETE /api/v1/wishlist/:packageId
 * @access  Protected (User)
 * @desc    Remove a package from wishlist
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: packageId } },
    { new: true }
  ).populate('wishlist', 'title price slug category images');

  res.json({
    success: true,
    data: user?.wishlist || [],
    message: 'Package removed from saved wishlist',
  });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
