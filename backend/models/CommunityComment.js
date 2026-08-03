const mongoose = require('mongoose');

const communityCommentSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ['post', 'answer'],
    required: true,
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityComment',
    default: null,
    index: true
  },
  depth: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'authorModel',
    required: true
  },
  authorModel: {
    type: String,
    enum: ['Student', 'User', 'Teacher'],
    default: 'Student'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: [true, 'Please provide comment text'],
    trim: true
  },
  images: [{
    type: String
  }],
  attachments: [{
    filename: String,
    fileUrl: String
  }],
  reactionsCount: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    celebrate: { type: Number, default: 0 },
    helpful: { type: Number, default: 0 },
    appreciate: { type: Number, default: 0 },
    funny: { type: Number, default: 0 }
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('CommunityComment', communityCommentSchema);
