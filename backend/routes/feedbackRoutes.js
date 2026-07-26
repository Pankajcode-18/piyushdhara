const express = require('express');
const router = express.Router();
const { getFeedbackByVideo, submitFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for fetching and submitting ratings & feedback
router.get('/public/feedback/video/:videoId', getFeedbackByVideo);
router.post('/feedback/video/:videoId', submitFeedback);

module.exports = router;
