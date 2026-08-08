const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  transactionUuid: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  studentName: {
    type: String,
    default: 'Student'
  },
  studentPhone: {
    type: String,
    default: ''
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['certification', 'course'],
    default: 'certification'
  },
  itemTitle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'NPR'
  },
  gateway: {
    type: String,
    enum: ['esewa', 'khalti'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  pidx: {
    type: String,
    default: ''
  },
  transactionCode: {
    type: String,
    default: ''
  },
  gatewayResponse: {
    type: Object,
    default: {}
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
