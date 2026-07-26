const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  qualification: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
    default: '',
  },
  designation: {
    type: String,
    default: 'Senior Lead Educator & Entrance Specialist',
  },
  bio: {
    type: String,
    default: 'Passionate educator dedicated to simplifying complex Mathematics, Physics, and Entrance concepts for students across Nepal.',
  },
  specializations: [
    { type: String }
  ],
  rating: {
    type: Number,
    default: 4.9,
  },
  studentsMentored: {
    type: String,
    default: '15,000+',
  },
  role: {
    type: String,
    enum: ['teacher', 'admin'],
    default: 'teacher',
  },
  verified: {
    type: Boolean,
    default: true,
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
