const mongoose = require('mongoose');

const certSubmissionSchema = new mongoose.Schema({
  certificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'CertLesson', required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  studentName: { type: String, default: 'Student' },
  submissionType: { type: String, enum: ['text', 'code', 'file'], default: 'code' },
  codeContent: { type: String, default: '' },
  textContent: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'graded', 'rejected'], default: 'pending' },
  marksObtained: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 20 },
  feedback: { type: String, default: '' },
  gradedBy: { type: String, default: '' },
  gradedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('CertSubmission', certSubmissionSchema);
