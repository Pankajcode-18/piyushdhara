const mongoose = require('mongoose');

const communityPollVoteSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  optionIds: [{
    type: String,
    required: true
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

communityPollVoteSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('CommunityPollVote', communityPollVoteSchema);
