const express = require('express');
const router = express.Router();
const { getDashboardStats, getCourseEnrollments } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/enrollments/:courseId', protect, admin, getCourseEnrollments);

module.exports = router;
