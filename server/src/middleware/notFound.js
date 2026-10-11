const ApiError = require('../utils/ApiError');

/**
 * 404 catch-all middleware for undefined routes.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

module.exports = notFound;

