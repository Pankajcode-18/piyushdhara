const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { chatWithAi, analyzeUploadedFile } = require('../controllers/aiController');

// Multer Storage Configuration for Document Uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `doc-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter(req, file, cb) {
    const filetypes = /pdf|doc|docx|txt|png|jpg|jpeg|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Supported file types: PDF, DOC/DOCX, TXT, PNG, JPG, WEBP'));
  }
});

// AI Chat & Document Analysis Endpoints
router.post('/chat', chatWithAi);
router.post('/upload-analyze', upload.single('file'), analyzeUploadedFile);

module.exports = router;
