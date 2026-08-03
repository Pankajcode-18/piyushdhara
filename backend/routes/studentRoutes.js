const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, enrollCourse, getEnrolledCourses, getStudentReportCard } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/bookmarks')
    .post(protect, addBookmark);

router.route('/bookmarks/:id')
    .delete(protect, removeBookmark);

router.route('/enroll')
    .post(protect, enrollCourse);

router.route('/my-courses')
    .get(protect, getEnrolledCourses);

router.route('/report-card')
    .get((req, res, next) => {
      // Optional authentication middleware
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
      }
      next();
    }, getStudentReportCard);

module.exports = router;
