const express = require('express');
const router = express.Router();
const { getCommentsByVideo, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/public/comments/video/:videoId', getCommentsByVideo);
router.post('/comments/video/:videoId', addComment);

// Protected delete route
router.delete('/comments/:commentId', protect, deleteComment);

module.exports = router;
