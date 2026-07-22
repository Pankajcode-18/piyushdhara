const User = require('../models/User');
// We would ideally have a Progress model to track which videos a student has completed
// const Progress = require('../models/Progress');

// @desc    Add bookmark
// @route   POST /api/student/bookmarks
// @access  Private
const addBookmark = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(req.user._id);

        if (!user.bookmarks.includes(id)) {
            user.bookmarks.push(id);
            await user.save();
        }

        res.json(user.bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove bookmark
// @route   DELETE /api/student/bookmarks/:id
// @access  Private
const removeBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        user.bookmarks = user.bookmarks.filter(b => b.toString() !== id);
        await user.save();

        res.json(user.bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addBookmark,
    removeBookmark
};
