const express = require('express');
const router = express.Router();
const {
    getPublishedCourses,
    getCourseDetails,
    getChapterContent,
    searchCourses,
    getVideoById,
    enrollStudent,
    getAllPublishedNotes,
    recordVisitorCount,
    getVisitorStats,
    recordStudyStreak,
    getPublicTeachers,
    createTeacherProfile
} = require('../controllers/publicController');

const { getPublicPlatformConfig } = require('../controllers/adminPlatformController');

router.get('/courses', getPublishedCourses);
router.get('/platform-config', getPublicPlatformConfig);
router.get('/search', searchCourses);
router.get('/courses/:id', getCourseDetails);
router.get('/chapters/:id/content', getChapterContent);
router.get('/videos/:id', getVideoById);
router.post('/enroll', enrollStudent);
router.get('/notes', getAllPublishedNotes);

// Teacher Profiles routes
router.get('/teachers', getPublicTeachers);
router.post('/teachers', createTeacherProfile);

// Visitor Analytics & Streak routes
router.post('/visitor', recordVisitorCount);
router.get('/visitor-stats', getVisitorStats);
router.post('/streak', recordStudyStreak);

module.exports = router;
