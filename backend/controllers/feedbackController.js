const Feedback = require('../models/Feedback');

// @desc    Get average rating & all feedbacks for a video
// @route   GET /api/public/feedback/video/:videoId
// @access  Public
const getFeedbackByVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const feedbacks = await Feedback.find({ video: videoId })
            .sort({ createdAt: -1 })
            .populate('user', 'name role');

        let averageRating = 0;
        if (feedbacks.length > 0) {
            const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = Number((sum / feedbacks.length).toFixed(1));
        }

        res.json({
            averageRating,
            totalRatings: feedbacks.length,
            feedbacks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit rating & feedback for a video
// @route   POST /api/feedback/video/:videoId
// @access  Public
const submitFeedback = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { rating, feedbackText, userName } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5 stars' });
        }

        const feedback = await Feedback.create({
            video: videoId,
            user: req.user ? req.user._id : undefined,
            userName: (req.user && req.user.name) || userName || 'Enrolled Student',
            rating,
            feedbackText: feedbackText || '',
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFeedbackByVideo,
    submitFeedback,
};
