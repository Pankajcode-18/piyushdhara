const mongoose = require('mongoose');

const communityReactionSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ['post', 'answer', 'comment'],
    required: true,
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'celebrate', 'helpful', 'appreciate', 'funny'],
    required: true
  }
}, { timestamps: true });

communityReactionSchema.index({ targetId: 1, user: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model('CommunityReaction', communityReactionSchema);
