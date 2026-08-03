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

const fs = require('fs');

// Ensure uploads directory exists on server
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration for Profile Photos
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit for high resolution photos
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed'));
  }
});

// Middleware to catch Multer upload errors gracefully
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('photo');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Multer Upload Error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image file size exceeds maximum limit of 25MB. Please select a smaller photo.' });
      }
      return res.status(400).json({ message: err.message || 'Error uploading profile photo' });
    }
    next();
  });
};

// Student Auth & Profile Routes
router.post('/register', verifyFirebaseToken, registerStudent);
router.post('/login', verifyFirebaseToken, loginStudent);
router.post('/google', verifyFirebaseToken, googleStudentLogin);
router.post('/logout', logoutStudent);

router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, handleUpload, updateStudentProfile);

module.exports = router;
