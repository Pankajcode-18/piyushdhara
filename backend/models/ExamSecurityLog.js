const mongoose = require('mongoose');

const ExamSecurityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    default: 'Student'
  },
  examId: {
    type: String,
    required: true,
    index: true
  },
  examTitle: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ['Quiz', 'Certification', 'MockTest', 'FinalExam'],
    default: 'Quiz'
  },
  attemptId: {
    type: String,
    required: true,
    index: true
  },
  securityPolicyMode: {
    type: String,
    enum: ['Strict', 'Standard', 'Practice'],
    default: 'Standard'
  },
  totalViolations: {
    type: Number,
    default: 0
  },
  submissionReason: {
    type: String,
    enum: ['Normal', 'Time Expired', 'Security Violation', 'Manual Submission'],
    default: 'Normal'
  },
  events: [
    {
      timestamp: { type: Date, default: Date.now },
      eventType: {
        type: String,
        enum: [
          'Exam Started',
          'Entered Full Screen',
          'Exited Full Screen',
          'Tab Changed',
          'Window Hidden',
          'Window Visible',
          'Page Reload Attempt',
          'Connection Lost',
          'Connection Reestablished',
          'Warning Displayed',
          'Manual Submit',
          'Auto Submit',
          'Time Expired'
        ],
        required: true
      },
      reason: { type: String },
      durationAwaySeconds: { type: Number, default: 0 },
      browserInfo: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ExamSecurityLog', ExamSecurityLogSchema);
