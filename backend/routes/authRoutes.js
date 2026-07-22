const express = require('express');
const router = express.Router();
const {
    registerStudent,
    loginUser,
    refreshToken,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

module.exports = router;
