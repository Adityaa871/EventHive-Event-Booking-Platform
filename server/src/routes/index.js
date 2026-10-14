const express = require('express');
const authRoutes = require('./authRoutes');
const packageRoutes = require('./packageRoutes');
const bookingRoutes = require('./bookingRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/health', healthRoutes);

module.exports = router;

