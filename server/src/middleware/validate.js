const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to run after express-validator chains.
 * Collects validation errors and throws a 422 ApiError if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, msg: e.msg }));
    throw new ApiError(422, 'Validation failed', formatted);
  }
  next();
};

module.exports = validate;

