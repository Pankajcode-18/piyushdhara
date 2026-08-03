const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const { protect } = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  createAnswer,
  getAnswersByPost,
  markBestAnswer,
  voteAnswer,
  createComment,
  getComments,
  reactToItem,
  votePoll,
  toggleSavePost,
  getUserCommunityProfile
} = require('../controllers/communityController');

// Multer Storage Configuration for Community Uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `community-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

const uploadFields = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'attachments', maxCount: 5 },
  { name: 'file', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);

// Community Posts Routes
router.route('/posts')
  .get(getAllPosts)
  .post(protect, uploadFields, createPost);

router.get('/posts/:id', getPostById);
router.post('/posts/:id/save', protect, toggleSavePost);

// Answer Routes
router.route('/posts/:id/answers')
  .get(getAnswersByPost)
  .post(protect, uploadFields, createAnswer);

router.put('/answers/:id/best', protect, markBestAnswer);
router.post('/answers/:id/vote', protect, voteAnswer);

// Poll Voting
router.post('/posts/:id/poll/vote', protect, votePoll);

// Comment & Nested Reply Routes
router.route('/comments')
  .get(getComments)
  .post(protect, createComment);

// Reaction Route (Like, Love, Celebrate, Helpful, Appreciate, Funny)
router.post('/reactions', protect, reactToItem);

// User Community Gamification Profile
router.get('/profile', protect, getUserCommunityProfile);

module.exports = router;
