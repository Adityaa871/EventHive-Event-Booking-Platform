const express = require('express');
const { body } = require('express-validator');
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

const packageValidation = [
  body('name').notEmpty().trim().withMessage('Package name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1 person'),
  body('description').notEmpty().withMessage('Description is required'),
];

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', protect, packageValidation, validate, createPackage);
router.put('/:id', protect, updatePackage);
router.delete('/:id', protect, deletePackage);

module.exports = router;

