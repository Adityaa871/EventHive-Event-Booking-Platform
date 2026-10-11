const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @desc    Authenticate admin and return JWT
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Include password field (excluded by default via select: false)
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(admin._id);

  res.json({
    success: true,
    data: {
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
    message: 'Login successful',
  });
});

/**
 * @route   GET /api/v1/auth/me
 * @access  Admin (protected)
 * @desc    Return current authenticated admin profile
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

module.exports = { login, getMe };

