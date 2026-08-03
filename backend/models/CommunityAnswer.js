const mongoose = require('mongoose');

const communityAnswerSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true
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
    required: [true, 'Please provide an answer description'],
    trim: true
  },
  codeSnippets: [{
    language: { type: String, default: 'javascript' },
    code: String
  }],
  images: [{
    type: String
  }],
  attachments: [{
    filename: String,
    fileUrl: String,
    fileType: String
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  netUpvotes: {
    type: Number,
    default: 0,
    index: true
  },
  isBestAnswer: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('CommunityAnswer', communityAnswerSchema);
