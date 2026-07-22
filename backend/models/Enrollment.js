const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide student name'],
        trim: true,
    },
    school: {
        type: String,
        required: [true, 'Please provide school name'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide phone number'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
