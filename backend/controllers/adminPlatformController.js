const PlatformConfig = require('../models/PlatformConfig');
const Certification = require('../models/Certification');
const Quiz = require('../models/Quiz');

// Get public platform configuration
const getPublicPlatformConfig = async (req, res) => {
  try {
    let config = await PlatformConfig.findOne()
      .populate('featuredCertificationIds')
      .populate('featuredQuizIds');

    if (!config) {
      config = await PlatformConfig.create({
        categories: [
          { name: 'Web Development', slug: 'web-development', iconName: 'Code', description: 'HTML, CSS, JS, React, Node', color: '#2563EB' },
          { name: 'Computer Science', slug: 'computer-science', iconName: 'Cpu', description: 'Data Structures, OS, Networking', color: '#7C3AED' },
          { name: 'Database & Cloud', slug: 'database-cloud', iconName: 'Database', description: 'MongoDB, SQL, AWS, Cloud', color: '#059669' },
          { name: 'Cyber Security', slug: 'cyber-security', iconName: 'Shield', description: 'Ethical Hacking, Web Security', color: '#DC2626' }
        ],
        announcements: [
          { title: '🎉 Professional Certification Exams Live!', content: 'All 15 modules with secure anti-cheat examination mode are now active.', badgeText: 'NEW FEATURE', badgeColor: '#10B981' }
        ]
      });
    }

    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error fetching platform config:', error);
    res.status(500).json({ message: 'Failed to load platform configuration' });
  }
};

// Update platform configuration (Admin only)
const updatePlatformConfig = async (req, res) => {
  try {
    const { heroBanner, announcements, categories, featuredCertificationIds, featuredQuizIds, stats } = req.body;

    let config = await PlatformConfig.findOne();
    if (!config) {
      config = new PlatformConfig();
    }

    if (heroBanner) config.heroBanner = { ...config.heroBanner, ...heroBanner };
    if (announcements) config.announcements = announcements;
    if (categories) config.categories = categories;
    if (featuredCertificationIds) config.featuredCertificationIds = featuredCertificationIds;
    if (featuredQuizIds) config.featuredQuizIds = featuredQuizIds;
    if (stats) config.stats = { ...config.stats, ...stats };

    await config.save();
    const updated = await PlatformConfig.findById(config._id)
      .populate('featuredCertificationIds')
      .populate('featuredQuizIds');

    res.json({
      success: true,
      message: 'Platform configuration updated successfully',
      config: updated
    });
  } catch (error) {
    console.error('Error updating platform config:', error);
    res.status(500).json({ message: 'Failed to update platform configuration' });
  }
};

module.exports = {
  getPublicPlatformConfig,
  updatePlatformConfig
};
