const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a chapter title'],
        trim: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
