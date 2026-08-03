const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true, index: true },
  certificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true },
  certificationTitle: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  studentName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  scorePercentage: { type: Number, default: 100 },
  instructorName: { type: String, default: 'Gaurav Sir & Team' },
  platformName: { type: String, default: 'PiyushDhara Learning Platform' },
  verificationUrl: { type: String, required: true },
  status: { type: String, enum: ['valid', 'revoked'], default: 'valid' },
  downloadsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
