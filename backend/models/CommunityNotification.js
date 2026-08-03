const mongoose = require('mongoose');

const communityNotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  type: {
    type: String,
    enum: ['answer', 'comment', 'reply', 'reaction', 'best_answer', 'poll_closed', 'mention'],
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    default: null
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CommunityNotification', communityNotificationSchema);
