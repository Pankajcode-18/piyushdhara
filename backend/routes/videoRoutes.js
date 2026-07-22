const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo
} = require('../controllers/videoController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.route('/')
    .get(getVideos)
    .post(protect, admin, upload.single('video'), createVideo);

router.route('/:id')
    .put(protect, admin, upload.single('video'), updateVideo)
    .delete(protect, admin, deleteVideo);

module.exports = router;
