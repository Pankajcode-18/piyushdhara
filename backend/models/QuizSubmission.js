const mongoose = require('mongoose');

const studentAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOptions: [{ type: String }],
  textAnswer: { type: String, default: '' },
  codeAnswer: { type: String, default: '' },
  isCorrect: { type: Boolean, default: false },
  marksObtained: { type: Number, default: 0 },
  maxPoints: { type: Number, default: 5 },
  isMarkedForReview: { type: Boolean, default: false }
});

const quizSubmissionSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true, index: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  quizTitle: { type: String, required: true },
  quizType: { type: String, default: 'practice' },
  
  studentEmail: { type: String, required: true, lowercase: true, index: true },
  studentName: { type: String, required: true },

  answers: [studentAnswerSchema],

  totalQuestions: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  unansweredCount: { type: Number, default: 0 },

  totalMarks: { type: Number, default: 0 },
  scoreObtained: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: 'F' },
  passed: { type: Boolean, default: false },

  timeTakenSeconds: { type: Number, default: 0 },
  attemptNumber: { type: Number, default: 1 },

  // Anti-Cheating Logs & Security Audit
  tabSwitchesCount: { type: Number, default: 0 },
  totalViolations: { type: Number, default: 0 },
  securityStatus: {
    type: String,
    enum: ['Clean', 'Warning', 'Security Violation'],
    default: 'Clean'
  },
  submissionReason: {
    type: String,
    enum: ['Normal', 'Time Expired', 'Security Violation', 'Manual Submission'],
    default: 'Normal'
  },
  copyPasteAttempts: { type: Number, default: 0 },
  autoSubmittedOnTimeout: { type: Boolean, default: false },

  // Manual Evaluation (For Descriptive / Code Assignments)
  evaluationStatus: {
    type: String,
    enum: ['auto_graded', 'pending_manual_review', 'manually_graded'],
    default: 'auto_graded'
  },
  teacherFeedback: { type: String, default: '' },
  evaluatedBy: { type: String, default: '' },
  evaluatedAt: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
