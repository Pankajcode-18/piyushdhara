const Subject = require('../models/Subject');

// @desc    Get subjects by course ID
// @route   GET /api/courses/:courseId/subjects
// @access  Public
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ course: req.params.courseId }).sort({ order: 1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a subject
// @route   POST /api/courses/:courseId/subjects
// @access  Private/Admin
const createSubject = async (req, res) => {
    try {
        const { title, order } = req.body;
        const courseId = req.params.courseId;

        const subject = new Subject({
            title,
            course: courseId,
            order
        });

        const createdSubject = await subject.save();
        res.status(201).json(createdSubject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (subject) {
            subject.title = req.body.title || subject.title;
            subject.order = req.body.order !== undefined ? req.body.order : subject.order;

            const updatedSubject = await subject.save();
            res.json(updatedSubject);
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (subject) {
            await Subject.deleteOne({ _id: subject._id });
            res.json({ message: 'Subject removed' });
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject
};
