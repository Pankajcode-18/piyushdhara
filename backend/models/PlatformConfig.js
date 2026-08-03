const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  badge: { type: String, default: '🎓 #1 LMS PLATFORM' },
  title: { type: String, default: 'Master In-Demand Tech Skills with Verified Certifications' },
  subtitle: { type: String, default: 'Interactive lessons, real-world coding projects, secure anti-cheat examinations, and instant industry certifications.' },
  primaryCtaText: { type: String, default: 'Explore Certifications' },
  primaryCtaLink: { type: String, default: '/certifications' },
  secondaryCtaText: { type: String, default: 'Take Practice Quiz' },
  secondaryCtaLink: { type: String, default: '/quizzes' },
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' }
});

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  badgeText: { type: String, default: 'ANNOUNCEMENT' },
  badgeColor: { type: String, default: '#2563EB' },
  linkUrl: { type: String, default: '' },
  isSticky: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  iconName: { type: String, default: 'Code' },
  description: { type: String, default: '' },
  color: { type: String, default: '#2563EB' }
});

const platformConfigSchema = new mongoose.Schema({
  heroBanner: { type: heroBannerSchema, default: () => ({}) },
  announcements: [announcementSchema],
  categories: [categorySchema],
  featuredCertificationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }],
  featuredQuizIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  stats: {
    studentsEnrolled: { type: Number, default: 370 },
    certificationsIssued: { type: Number, default: 120 },
    passRatePct: { type: Number, default: 94 },
    activeAssessments: { type: Number, default: 28 }
  }
}, { timestamps: true });

module.exports = mongoose.model('PlatformConfig', platformConfigSchema);
