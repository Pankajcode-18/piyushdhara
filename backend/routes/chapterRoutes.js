const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getChapters,
    createChapter,
    updateChapter,
    deleteChapter
} = require('../controllers/chapterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getChapters)
    .post(protect, admin, createChapter);

router.route('/:id')
    .put(protect, admin, updateChapter)
    .delete(protect, admin, deleteChapter);

// Mount Video and Note routes
const videoRouter = require('./videoRoutes');
const noteRouter = require('./noteRoutes');
router.use('/:chapterId/videos', videoRouter);
router.use('/:chapterId/notes', noteRouter);

module.exports = router;
