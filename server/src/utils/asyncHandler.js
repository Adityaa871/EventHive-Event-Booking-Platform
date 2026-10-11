/**
 * Wraps async route handlers to catch errors and forward them to Express
 * error-handling middleware, avoiding try/catch boilerplate everywhere.
 *
 * @param {Function} fn - async express route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

