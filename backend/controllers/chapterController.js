const Chapter = require('../models/Chapter');

// @desc    Get chapters by subject ID
// @route   GET /api/subjects/:subjectId/chapters
// @access  Public
const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find({ subject: req.params.subjectId }).sort({ order: 1 });
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a chapter
// @route   POST /api/subjects/:subjectId/chapters
// @access  Private/Admin
const createChapter = async (req, res) => {
    try {
        const { title, order } = req.body;
        const subjectId = req.params.subjectId;

        const chapter = new Chapter({
            title,
            subject: subjectId,
            order
        });

        const createdChapter = await chapter.save();
        res.status(201).json(createdChapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a chapter
// @route   PUT /api/chapters/:id
// @access  Private/Admin
const updateChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);

        if (chapter) {
            chapter.title = req.body.title || chapter.title;
            chapter.order = req.body.order !== undefined ? req.body.order : chapter.order;

            const updatedChapter = await chapter.save();
            res.json(updatedChapter);
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a chapter
// @route   DELETE /api/chapters/:id
// @access  Private/Admin
const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);

        if (chapter) {
            await Chapter.deleteOne({ _id: chapter._id });
            res.json({ message: 'Chapter removed' });
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChapters,
    createChapter,
    updateChapter,
    deleteChapter
};
