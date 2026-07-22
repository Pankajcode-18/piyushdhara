const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a video title'],
        trim: true,
    },
    description: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
        default: 'no-video-photo.jpg'
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
    },
    duration: {
        type: Number, // duration in seconds
    },
    isFree: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model('Video', videoSchema);
