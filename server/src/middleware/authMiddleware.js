const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes: verify JWT and attach user to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Not authorized — invalid or expired token');
  }

  // Look for user in User model first
  let user = await User.findById(decoded.id);

  // Fallback to legacy Admin model if user not found in User collection
  if (!user) {
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      user = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      };
    }
  }

  if (!user) {
    throw new ApiError(401, 'Not authorized — user account not found');
  }

  if (user.isActive === false) {
    throw new ApiError(403, 'Account has been deactivated. Please contact support.');
  }

  req.user = user;
  if (user.role === 'admin') {
    req.admin = user; // Preserve backward compatibility for req.admin
  }

  next();
});

/**
 * Admin-only authorization check
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied — administrator privileges required');
  }
  next();
};

/**
 * Optional authentication: attaches req.user if a valid token is provided, continues otherwise
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.id);
      if (!user) {
        const admin = await Admin.findById(decoded.id);
        if (admin) user = { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' };
      }
      if (user && user.isActive !== false) {
        req.user = user;
        if (user.role === 'admin') req.admin = user;
      }
    }
  } catch {
    // Ignore invalid tokens for optional authentication
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
