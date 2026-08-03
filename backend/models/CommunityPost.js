const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  postType: {
    type: String,
    enum: ['doubt', 'discussion', 'poll'],
    default: 'discussion',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a post title'],
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Please provide content or description'],
    trim: true
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
  category: {
    type: String,
    enum: [
      'Academic Doubts',
      'Study Tips & Notes',
      'Entrance Preparation',
      'Coding & Projects',
      'Placement & Internships',
      'Career Advice',
      'Success Stories',
      'College & Events',
      'General Discussion'
    ],
    default: 'General Discussion',
    index: true
  },
  subject: {
    type: String,
    default: 'General',
    trim: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'N/A'],
    default: 'N/A'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    type: String
  }],
  attachments: [{
    filename: String,
    fileUrl: String,
    fileType: String
  }],
  poll: {
    question: String,
    options: [{
      optionId: String,
      text: String,
      image: String,
      votesCount: { type: Number, default: 0 }
    }],
    durationDays: { type: Number, default: 7 },
    expiresAt: Date,
    allowMultiple: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    totalVotes: { type: Number, default: 0 }
  },
  bestAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityAnswer',
    default: null
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  upvotesCount: {
    type: Number,
    default: 0
  },
  downvotesCount: {
    type: Number,
    default: 0
  },
  answersCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  reactionsCount: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    celebrate: { type: Number, default: 0 },
    helpful: { type: Number, default: 0 },
    appreciate: { type: Number, default: 0 },
    funny: { type: Number, default: 0 }
  },
  trendingScore: {
    type: Number,
    default: 0,
    index: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

communityPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
