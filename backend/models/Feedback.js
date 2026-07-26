const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: [true, 'Please provide a star rating (1 to 5)'],
        min: 1,
        max: 5,
    },
    feedbackText: {
        type: String,
        trim: true,
        default: '',
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
