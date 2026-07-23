const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, enrollCourse } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/bookmarks')
    .post(protect, addBookmark);

router.route('/bookmarks/:id')
    .delete(protect, removeBookmark);

router.route('/enroll')
    .post(protect, enrollCourse);

module.exports = router;
