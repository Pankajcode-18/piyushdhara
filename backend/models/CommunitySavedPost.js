const mongoose = require('mongoose');

const communitySavedPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true
  }
}, { timestamps: true });

communitySavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('CommunitySavedPost', communitySavedPostSchema);
