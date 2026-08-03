const multer = require('multer');
const path = require('path');

const fs = require('fs');

// Temporary Local Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif|pdf|mp4|mkv|mov|docx|doc|ppt|pptx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Allow any standard video/image/document mimetypes
    const isAcceptedMime = file.mimetype.startsWith('video/') || 
                           file.mimetype.startsWith('image/') || 
                           file.mimetype === 'application/pdf' ||
                           file.mimetype.includes('document') ||
                           file.mimetype.includes('presentation') ||
                           file.mimetype.includes('msword') ||
                           file.mimetype.includes('powerpoint');

    if (extname || isAcceptedMime) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file format uploaded!'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
