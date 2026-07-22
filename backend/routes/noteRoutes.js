const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.route('/')
    .get(getNotes)
    .post(protect, admin, upload.single('noteFile'), createNote);

router.route('/:id')
    .put(protect, admin, upload.single('noteFile'), updateNote)
    .delete(protect, admin, deleteNote);

module.exports = router;
