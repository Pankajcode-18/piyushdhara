const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a note title'],
        trim: true,
    },
    description: {
        type: String,
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required (PDF/DOCX)'],
    },
    previewImageUrl: {
        type: String,
    },
    isDownloadEnabled: {
        type: Boolean,
        default: true,
    },
    isViewOnlineEnabled: {
        type: Boolean,
        default: true,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
