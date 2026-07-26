const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  photo: {
    type: String,
    default: '',
  },
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['student'],
    default: 'student',
  },
  provider: {
    type: String,
    enum: ['password', 'google'],
    default: 'password',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },

  // Personal Information
  phone: { type: String, default: '' },
  gender: { type: String, default: '' },
  dob: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: 'Nepal' },
  postalCode: { type: String, default: '' },

  // Academic Information
  school: { type: String, default: '' },
  grade: { type: String, default: '' },
  board: { type: String, default: '' },
  stream: { type: String, default: '' },
  graduationYear: { type: String, default: '' },

  // Learning & Career Goals
  interests: [{ type: String }],
  skills: [{ type: String }],
  favoriteSubjects: [{ type: String }],
  learningGoals: { type: String, default: '' },
  careerPlan: { type: String, default: '' },
  dreamCollege: { type: String, default: '' },
  dreamJob: { type: String, default: '' },
  bio: { type: String, default: '' },

  // Enrolled Batches & Learning Progress
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }
  ],
  completedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }
  ],
  certificates: [
    {
      courseTitle: String,
      issuedAt: Date,
      certificateUrl: String,
    }
  ],
  streakCount: {
    type: Number,
    default: 1,
  },
  lastStudyDate: {
    type: String, // 'YYYY-MM-DD'
  },
}, { timestamps: true });

// Pre-save hook to generate a clean Student ID e.g. PD-STUDENT-8942
studentSchema.pre('save', function(next) {
  if (!this.studentId) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    this.studentId = `PD-STUDENT-${randomDigits}`;
  }
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Student', studentSchema);
