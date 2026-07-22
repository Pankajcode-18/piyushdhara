const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to get courseId from parent router
const {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject
} = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSubjects)
    .post(protect, admin, createSubject);

router.route('/:id')
    .put(protect, admin, updateSubject)
    .delete(protect, admin, deleteSubject);

// Mount chapters routes
const chapterRouter = require('./chapterRoutes');
router.use('/:subjectId/chapters', chapterRouter);

module.exports = router;
