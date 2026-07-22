const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a subject title'],
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
