const mongoose = require('mongoose');

const certProgressSchema = new mongoose.Schema({
  certificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  studentName: { type: String, default: 'Student' },
  
  // Progress Data
  completedLessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CertLesson' }],
  currentLessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'CertLesson' },

  // Lesson Quiz Performance Map
  quizScores: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'CertLesson' },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 100 },
    passed: { type: Boolean, default: false },
    attemptedAt: { type: Date, default: Date.now }
  }],

  // Assignments Status
  assignmentSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CertSubmission' }],

  // Final Exam Status
  finalExam: {
    attempted: { type: Boolean, default: false },
    passed: { type: Boolean, default: false },
    scorePercentage: { type: Number, default: 0 },
    marksObtained: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 100 },
    attemptedAt: { type: Date }
  },

  overallPercentage: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'completed', 'failed'], default: 'in_progress' },
  isEnrolled: { type: Boolean, default: true },
  enrolledAt: { type: Date, default: Date.now },
  certificateIssued: { type: Boolean, default: false },
  certificateId: { type: String, default: '' }
}, { timestamps: true });

// Compound index to ensure single progress doc per student per certification
certProgressSchema.index({ certificationId: 1, studentEmail: 1 }, { unique: true });

module.exports = mongoose.model('CertProgress', certProgressSchema);
