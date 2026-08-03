const mongoose = require('mongoose');

const communityReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  targetType: {
    type: String,
    enum: ['post', 'answer', 'comment'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('CommunityReport', communityReportSchema);
