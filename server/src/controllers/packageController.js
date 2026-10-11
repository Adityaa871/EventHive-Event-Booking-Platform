const Package = require('../models/Package');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/packages
 * @access  Public
 * @desc    List active packages with optional filters, search, pagination, sorting
 */
const getPackages = asyncHandler(async (req, res) => {
  const { category, search, featured, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [packages, total] = await Promise.all([
    Package.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Package.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: packages,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * @route   GET /api/v1/packages/:id
 * @access  Public
 * @desc    Get a single package by MongoDB id or slug
 */
const getPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[a-f\d]{24}$/i.test(id);

  const pkg = await Package.findOne(
    isObjectId ? { _id: id } : { slug: id }
  ).lean();

  if (!pkg) throw new ApiError(404, 'Package not found');

  res.json({ success: true, data: pkg });
});

/**
 * @route   POST /api/v1/packages
 * @access  Admin
 * @desc    Create a new event package
 */
const createPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.create(req.body);
  res.status(201).json({ success: true, data: pkg, message: 'Package created successfully' });
});

/**
 * @route   PUT /api/v1/packages/:id
 * @access  Admin
 * @desc    Update an existing package
 */
const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pkg) throw new ApiError(404, 'Package not found');
  res.json({ success: true, data: pkg, message: 'Package updated successfully' });
});

/**
 * @route   DELETE /api/v1/packages/:id
 * @access  Admin
 * @desc    Soft-delete a package by setting isActive = false
 */
const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!pkg) throw new ApiError(404, 'Package not found');
  res.json({ success: true, message: 'Package deleted successfully' });
});

module.exports = { getPackages, getPackage, createPackage, updatePackage, deletePackage };

