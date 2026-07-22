const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const courseUploads = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'teacherImage', maxCount: 1 }
]);

router.route('/')
    .get(getCourses)
    .post(protect, admin, courseUploads, createCourse);

router.route('/:id')
    .get(getCourseById)
    .put(protect, admin, courseUploads, updateCourse)
    .delete(protect, admin, deleteCourse);

// Mount subjects routes
const subjectRouter = require('./subjectRoutes');
router.use('/:courseId/subjects', subjectRouter);

module.exports = router;
