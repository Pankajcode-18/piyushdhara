const Comment = require('../models/Comment');

// @desc    Get all comments for a video
// @route   GET /api/public/comments/video/:videoId
// @access  Public
const getCommentsByVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const comments = await Comment.find({ video: videoId })
            .sort({ createdAt: -1 })
            .populate('user', 'name role email phone');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to a video
// @route   POST /api/comments/video/:videoId
// @access  Public
const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { text, userName, userRole, parentComment } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text cannot be empty' });
        }

        const comment = await Comment.create({
            video: videoId,
            user: req.user ? req.user._id : undefined,
            userName: (req.user && req.user.name) || userName || 'Enrolled Student',
            userRole: (req.user && req.user.role) || userRole || 'student',
            text: text.trim(),
            parentComment: parentComment || null,
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Only author or admin can delete
        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCommentsByVideo,
    addComment,
    deleteComment,
};
