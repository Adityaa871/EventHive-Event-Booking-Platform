const { Router } = require('express');
const { body } = require('express-validator');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = Router();

const createPackageValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category')
    .isIn(['birthday', 'wedding', 'corporate', 'anniversary', 'other'])
    .withMessage('Invalid category'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

const updatePackageValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('category')
    .optional()
    .isIn(['birthday', 'wedding', 'corporate', 'anniversary', 'other'])
    .withMessage('Invalid category'),
  body('shortDescription').optional().notEmpty().withMessage('Short description cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// Public routes
router.get('/', getPackages);
router.get('/:id', getPackage);

// Admin-protected routes
router.post('/', protect, createPackageValidation, validate, createPackage);
router.put('/:id', protect, updatePackageValidation, validate, updatePackage);
router.delete('/:id', protect, deletePackage);

module.exports = router;
