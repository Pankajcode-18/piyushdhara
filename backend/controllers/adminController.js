const User = require('../models/User');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const Note = require('../models/Note');
const Enrollment = require('../models/Enrollment');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate('course', 'title').sort({ createdAt: -1 });
        const uniqueStudents = new Set(enrollments.map(e => e.email)).size;
        
        const totalCourses = await Course.countDocuments();
        const totalSubjects = await Subject.countDocuments();
        const totalChapters = await Chapter.countDocuments();
        const totalVideos = await Video.countDocuments();
        const totalNotes = await Note.countDocuments();
        const totalEnrollments = enrollments.length;

        // Recent 6 enrollments
        const recentEnrollments = enrollments.slice(0, 6).map(e => ({
            _id: e._id,
            name: e.name,
            email: e.email,
            school: e.school,
            phone: e.phone,
            courseTitle: e.course?.title || 'PiyushDhara Batch',
            createdAt: e.createdAt
        }));

        // Course Enrollment Breakdown for Realtime Charts
        const courses = await Course.find().lean();
        const courseBreakdown = await Promise.all(courses.map(async (c) => {
            const enrollCount = await Enrollment.countDocuments({ course: c._id });
            return {
                _id: c._id,
                title: c.title,
                price: c.price,
                isPublished: c.isPublished,
                enrollCount
            };
        }));

        res.json({
            totalStudents: uniqueStudents > 0 ? uniqueStudents : totalEnrollments,
            totalCourses,
            totalSubjects,
            totalChapters,
            totalVideos,
            totalNotes,
            totalEnrollments,
            recentEnrollments,
            courseBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get enrollments for a specific course
// @route   GET /api/admin/enrollments/:courseId
// @access  Private/Admin
const getCourseEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ course: req.params.courseId }).sort({ createdAt: -1 });
        res.json({ count: enrollments.length, enrollments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getCourseEnrollments
};
