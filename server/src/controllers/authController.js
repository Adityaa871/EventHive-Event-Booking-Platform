const User = require('../models/User');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   POST /api/v1/auth/register
 * @access  Public
 * @desc    Register a new customer account
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email address already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'user',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        wishlist: user.wishlist || [],
      },
    },
    message: 'Account created successfully',
  });
});

/**
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @desc    Authenticate customer or admin and return JWT
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check in User model first
  let user = await User.findOne({ email }).select('+password');
  let role = 'user';

  if (user) {
    if (!(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    if (user.isActive === false) {
      throw new ApiError(403, 'Account has been deactivated. Please contact support.');
    }
    role = user.role;
  } else {
    // Check legacy Admin model
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    user = admin;
    role = 'admin';
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: role,
        wishlist: user.wishlist || [],
      },
      // Keep admin object for backward compatibility with old frontend code
      admin: role === 'admin' ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
      } : null,
    },
    message: 'Login successful',
  });
});

/**
 * @route   GET /api/v1/auth/me
 * @access  Protected
 * @desc    Return currently authenticated profile
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'title price slug category images')
    .lean();

  if (user) {
    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        wishlist: user.wishlist || [],
      },
    });
  }

  // Legacy admin fallback
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      wishlist: [],
    },
  });
});

/**
 * @route   PATCH /api/v1/auth/profile
 * @access  Protected
 * @desc    Update client profile details
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();

  await user.save();

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    message: 'Profile updated successfully',
  });
});

/**
 * @route   GET /api/v1/auth/users
 * @access  Admin
 * @desc    List all registered users with pagination & search
 */
const getUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = { role: 'user' };

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

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * @route   PATCH /api/v1/auth/users/:id/toggle-status
 * @access  Admin
 * @desc    Toggle user active status
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    data: user,
    message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  getUsers,
  toggleUserStatus,
};
