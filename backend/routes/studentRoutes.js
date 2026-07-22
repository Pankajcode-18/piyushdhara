const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/bookmarks')
    .post(protect, addBookmark);

router.route('/bookmarks/:id')
    .delete(protect, removeBookmark);

module.exports = router;
