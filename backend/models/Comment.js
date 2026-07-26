const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    userName: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    text: {
        type: String,
        required: [true, 'Please add a comment text'],
        trim: true,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
