const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' },
  banner: { type: String, default: '' },
  category: { type: String, default: 'Web Development' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  estimatedDuration: { type: String, default: '10 Hours' },
  language: { type: String, default: 'English & Nepali' },
  instructor: {
    name: { type: String, default: 'Pankaj Baduwal' },
    designation: { type: String, default: 'Lead Educator & Engineer' },
    photo: { type: String, default: '/pankaj-baduwal.jpg' },
    bio: { type: String, default: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.' }
  },
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }],
  skillsGained: [{ type: String }],
  certificateInfo: {
    title: { type: String, default: 'Verified Professional Certificate' },
    minPassingPercentage: { type: Number, default: 70 },
    downloadAllowed: { type: Boolean, default: true },
    shareAllowed: { type: Boolean, default: true },
    verificationEnabled: { type: Boolean, default: true }
  },
  assessmentRules: {
    quizWeightPercentage: { type: Number, default: 30 },
    assignmentWeightPercentage: { type: Number, default: 30 },
    finalExamWeightPercentage: { type: Number, default: 40 },
    passingPercentage: { type: Number, default: 70 },
    maxRetakes: { type: Number, default: 3 }
  },
  studyInstructions: [{ type: String }],
  references: [{
    type: { type: String, enum: ['Documentation', 'Book', 'Article', 'YouTube', 'GitHub', 'Paper'], default: 'Documentation' },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' }
  }],
  finalExam: {
    title: { type: String, default: 'Final Certification Assessment' },
    instructions: { type: String, default: 'Complete all questions within the time limit. Minimum 70% required to pass.' },
    timeLimitMinutes: { type: Number, default: 30 },
    questions: [{
      questionText: { type: String, required: true },
      type: { type: String, enum: ['mcq', 'multi', 'tf', 'blank'], default: 'mcq' },
      options: [{ type: String }],
      correctAnswers: [{ type: String }],
      explanation: { type: String, default: '' },
      points: { type: Number, default: 10 }
    }]
  },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 128 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
