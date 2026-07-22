const multer = require('multer');
const path = require('path');

// Temporary Local Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Will create an 'uploads' directory
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf|mp4|mkv|mov|docx|doc|ppt|pptx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Allow any standard video/image/document mimetypes
    const isAcceptedMime = file.mimetype.startsWith('video/') || 
                           file.mimetype.startsWith('image/') || 
                           file.mimetype === 'application/pdf' ||
                           file.mimetype.includes('document') ||
                           file.mimetype.includes('presentation') ||
                           file.mimetype.includes('msword') ||
                           file.mimetype.includes('powerpoint');

    if (extname && isAcceptedMime) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
