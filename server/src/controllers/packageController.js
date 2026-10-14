const Package = require('../models/Package');

// @desc    Get all packages (with search, category filter, and pagination)
// @route   GET /api/v1/packages
// @access  Public
const getPackages = async (req, res, next) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = { featured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'capacity_asc') sortOptions = { capacity: 1 };
    if (sort === 'capacity_desc') sortOptions = { capacity: -1 };

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: packages.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      packages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package by ID
// @route   GET /api/v1/packages/:id
// @access  Public
const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    res.json({
      success: true,
      package: pkg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new package
// @route   POST /api/v1/packages
// @access  Private (Admin)
const createPackage = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      duration,
      capacity,
      description,
      inclusions,
      image,
      featured,
    } = req.body;

    const formattedInclusions = Array.isArray(inclusions)
      ? inclusions
      : typeof inclusions === 'string'
      ? inclusions.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    const newPackage = await Package.create({
      name,
      category,
      price: Number(price),
      duration,
      capacity: Number(capacity),
      description,
      inclusions: formattedInclusions,
      image: image || undefined,
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: newPackage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a package
// @route   PUT /api/v1/packages/:id
// @access  Private (Admin)
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    const updates = { ...req.body };

    if (updates.inclusions && typeof updates.inclusions === 'string') {
      updates.inclusions = updates.inclusions
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: updatedPackage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a package
// @route   DELETE /api/v1/packages/:id
// @access  Private (Admin)
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Package deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};

