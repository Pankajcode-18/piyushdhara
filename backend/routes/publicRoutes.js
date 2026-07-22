const express = require('express');
const router = express.Router();
const {
    getPublishedCourses,
    getCourseDetails,
    getChapterContent,
    searchCourses,
    getVideoById,
    enrollStudent,
    getAllPublishedNotes
} = require('../controllers/publicController');

router.get('/courses', getPublishedCourses);
router.get('/search', searchCourses);
router.get('/courses/:id', getCourseDetails);
router.get('/chapters/:id/content', getChapterContent);
router.get('/videos/:id', getVideoById);
router.post('/enroll', enrollStudent);
router.get('/notes', getAllPublishedNotes);

module.exports = router;
