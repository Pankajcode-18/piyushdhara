const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, enrollCourse, getEnrolledCourses } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/bookmarks')
    .post(protect, addBookmark);

router.route('/bookmarks/:id')
    .delete(protect, removeBookmark);

router.route('/enroll')
    .post(protect, enrollCourse);

router.route('/my-courses')
    .get(protect, getEnrolledCourses);

module.exports = router;
