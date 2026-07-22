const Note = require('../models/Note');

// @desc    Get notes by chapter ID
// @route   GET /api/chapters/:chapterId/notes
// @access  Public
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ chapter: req.params.chapterId }).sort({ order: 1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a note
// @route   POST /api/chapters/:chapterId/notes
// @access  Private/Admin
const createNote = async (req, res) => {
    try {
        const { title, description, isDownloadEnabled, isViewOnlineEnabled, isPublished, order } = req.body;
        const chapterId = req.params.chapterId;

        const fileUrl = req.file ? req.file.path.replace(/\\/g, '/') : req.body.fileUrl;

        if (!fileUrl) {
            return res.status(400).json({ message: 'Note file or URL is required' });
        }

        const note = new Note({
            title,
            description,
            fileUrl,
            isDownloadEnabled,
            isViewOnlineEnabled,
            isPublished,
            chapter: chapterId,
            order
        });

        const createdNote = await note.save();
        res.status(201).json(createdNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private/Admin
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (note) {
            note.title = req.body.title || note.title;
            note.description = req.body.description !== undefined ? req.body.description : note.description;
            note.isDownloadEnabled = req.body.isDownloadEnabled !== undefined ? req.body.isDownloadEnabled : note.isDownloadEnabled;
            note.isViewOnlineEnabled = req.body.isViewOnlineEnabled !== undefined ? req.body.isViewOnlineEnabled : note.isViewOnlineEnabled;
            note.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : note.isPublished;
            note.order = req.body.order !== undefined ? req.body.order : note.order;
            
            if (req.file) {
                note.fileUrl = req.file.path;
            } else if (req.body.fileUrl) {
                note.fileUrl = req.body.fileUrl;
            }

            const updatedNote = await note.save();
            res.json(updatedNote);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private/Admin
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (note) {
            await Note.deleteOne({ _id: note._id });
            res.json({ message: 'Note removed' });
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
