const express = require('express');
const router = express.Router();
const { getDashboardStats, getCourseEnrollments } = require('../controllers/adminController');
const { getPublicPlatformConfig, updatePlatformConfig } = require('../controllers/adminPlatformController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/enrollments/:courseId', protect, admin, getCourseEnrollments);
router.get('/platform-config', protect, admin, getPublicPlatformConfig);
router.put('/platform-config', protect, admin, updatePlatformConfig);

module.exports = router;
