const express = require('express');
const { body } = require('express-validator');
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

// Validation rules for login
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
