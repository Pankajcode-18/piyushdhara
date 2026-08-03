const mongoose = require('mongoose');

const certModuleSchema = new mongoose.Schema({
  certificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('CertModule', certModuleSchema);
