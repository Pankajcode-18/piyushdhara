const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    thumbnailUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    bannerUrl: {
        type: String,
    },
    instructorName: {
        type: String,
        default: 'Gaurav Sir & Team',
    },
    teacherImageUrl: {
        type: String,
        default: '/teacher.png',
    },
    price: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
