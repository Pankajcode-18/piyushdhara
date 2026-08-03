const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq_single', 'mcq_multi', 'true_false', 'fill_blank', 'short_answer', 'code'],
    default: 'mcq_single'
  },
  options: [{ type: String }],
  correctAnswers: [{ type: String }],
  explanation: { type: String, default: '' },
  points: { type: Number, default: 5 },
  negativePoints: { type: Number, default: 0 },
  codeSnippet: { type: String, default: '' },
  codeLanguage: { type: String, default: 'javascript' },
  image: { type: String, default: '' }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  instructions: { type: String, default: 'Read each question carefully before submitting your answer.' },
  
  // Type of Assessment
  type: {
    type: String,
    enum: ['weekly', 'monthly', 'practice', 'mock', 'assignment', 'certification', 'final_exam'],
    default: 'practice'
  },

  category: { type: String, default: 'General Knowledge' },
  subject: { type: String, default: 'Computer Science' },
  course: { type: String, default: '' },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },

  // Scheduling & Timing
  durationMinutes: { type: Number, default: 30 },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  autoStart: { type: Boolean, default: false },
  autoSubmitOnTimeout: { type: Boolean, default: true },

  // Attempt Limits & Rules
  attemptsAllowed: {
    type: String,
    enum: ['one', 'multiple', 'unlimited'],
    default: 'unlimited'
  },
  maxAttempts: { type: Number, default: 1 },
  passingPercentage: { type: Number, default: 70 },

  // Security & Anti-Cheating Settings
  settings: {
    randomizeQuestions: { type: Boolean, default: false },
    randomizeOptions: { type: Boolean, default: false },
    showTimer: { type: Boolean, default: true },
    allowReviewBeforeSubmit: { type: Boolean, default: true },
    showScoreImmediately: { type: Boolean, default: true },
    showAnswersPostQuiz: { type: Boolean, default: true },
    showLeaderboard: { type: Boolean, default: true },
    detectTabSwitch: { type: Boolean, default: true },
    maxTabSwitchesAllowed: { type: Number, default: 3 },
    disableCopyPaste: { type: Boolean, default: true },
    enableNegativeMarking: { type: Boolean, default: false },
    securityPolicy: {
      mode: { type: String, enum: ['Strict', 'Standard', 'Practice'], default: 'Standard' },
      enforceFullscreen: { type: Boolean, default: true },
      preventTabSwitch: { type: Boolean, default: true },
      preventReload: { type: Boolean, default: true },
      maxViolations: { type: Number, default: 3 }
    }
  },

  // Assignment Specific Settings
  assignmentDetails: {
    submissionDeadline: { type: Date, default: null },
    maxFileSizeMb: { type: Number, default: 10 },
    allowedFileTypes: [{ type: String }],
    maxMarks: { type: Number, default: 100 },
    rubricNotes: { type: String, default: '' }
  },

  // Questions Array
  questions: [questionSchema],

  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },

  createdBy: { type: String, default: 'Gaurav Sir & Technical Team' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
