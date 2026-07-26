const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const {
  registerStudent,
  loginStudent,
  googleStudentLogin,
  logoutStudent,
  getStudentProfile,
  updateStudentProfile,
} = require('../controllers/studentAuthController');

const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');
const { protectJwt, authorizeRoles } = require('../middleware/jwtCookieMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Multer Storage Configuration for Profile Photos
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  }
});

// Student Auth & Profile Routes
router.post('/register', verifyFirebaseToken, registerStudent);
router.post('/login', verifyFirebaseToken, loginStudent);
router.post('/google', verifyFirebaseToken, googleStudentLogin);
router.post('/logout', logoutStudent);

router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, upload.single('photo'), updateStudentProfile);

module.exports = router;
