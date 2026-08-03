const mongoose = require('mongoose');

const certLessonSchema = new mongoose.Schema({
  certificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'CertModule', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true, default: 1 },
  estimatedTimeMinutes: { type: Number, default: 15 },
  
  // Rich Lesson Content
  contentHtml: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  
  codeSnippets: [{
    title: { type: String, default: 'Code Example' },
    language: { type: String, default: 'html' },
    code: { type: String, required: true },
    explanation: { type: String, default: '' }
  }],

  callouts: [{
    type: { type: String, enum: ['note', 'tip', 'warning', 'info'], default: 'tip' },
    title: { type: String, default: 'Key Takeaway' },
    content: { type: String, required: true }
  }],

  downloadableAssets: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    fileType: { type: String, default: 'pdf' },
    size: { type: String, default: '1.2 MB' }
  }],

  // Quiz embedded in lesson
  hasQuiz: { type: Boolean, default: false },
  quiz: {
    title: { type: String, default: 'Lesson Checkpoint Quiz' },
    passingPercentage: { type: Number, default: 70 },
    questions: [{
      questionText: { type: String, required: true },
      type: { type: String, enum: ['mcq', 'multi', 'tf', 'blank'], default: 'mcq' },
      options: [{ type: String }],
      correctAnswers: [{ type: String }],
      explanation: { type: String, default: '' }
    }]
  },

  // Assignment embedded in lesson
  hasAssignment: { type: Boolean, default: false },
  assignment: {
    title: { type: String, default: 'Practical Assignment' },
    instructions: { type: String, default: 'Complete the exercise according to requirements.' },
    assignmentType: { type: String, enum: ['text', 'code', 'file'], default: 'code' },
    maxMarks: { type: Number, default: 20 },
    sampleCodeTemplate: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('CertLesson', certLessonSchema);
