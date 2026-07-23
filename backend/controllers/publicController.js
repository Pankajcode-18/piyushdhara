const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const Note = require('../models/Note');
const Enrollment = require('../models/Enrollment');

// @desc    Get all published courses
// @route   GET /api/public/courses
// @access  Public
const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ order: 1 });
        const coursesWithCount = await Promise.all(courses.map(async (course) => {
            const enrollCount = await Enrollment.countDocuments({ course: course._id });
            return { ...course._doc, enrollCount };
        }));
        res.json(coursesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get full course details (Subjects, Chapters)
// @route   GET /api/public/courses/:id
// @access  Public
const getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const subjects = await Subject.find({ course: course._id }).sort({ order: 1 });
        
        // This is a simplified approach. In a real scenario, you might want to aggregate this
        // to avoid multiple roundtrips, or lazy load chapters on the frontend.
        const courseData = {
            ...course._doc,
            subjects: await Promise.all(subjects.map(async (subject) => {
                const chapters = await Chapter.find({ subject: subject._id }).sort({ order: 1 });
                return {
                    ...subject._doc,
                    chapters
                };
            }))
        };

        res.json(courseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get chapter content (Videos, Notes)
// @route   GET /api/public/chapters/:id/content
// @access  Public (or protected if paid)
const getChapterContent = async (req, res) => {
    try {
        const chapterId = req.params.id;
        // Ideally check if user has access to this course (if it's paid)
        
        const videos = await Video.find({ chapter: chapterId, isPublished: true }).sort({ order: 1 });
        const notes = await Note.find({ chapter: chapterId, isPublished: true }).sort({ order: 1 });

        res.json({
            videos,
            notes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search courses
// @route   GET /api/public/search?q=query
// @access  Public
const searchCourses = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        const courses = await Course.find({
            isPublished: true,
            title: { $regex: query, $options: 'i' }
        });

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single video details
// @route   GET /api/public/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll student in a course
// @route   POST /api/public/enroll
// @access  Public
const enrollStudent = async (req, res) => {
    try {
        const { name, school, phone, email, courseId } = req.body;
        if (!name || !school || !phone || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const enrollmentData = {
            name,
            school,
            phone,
            email
        };
        
        if (courseId) {
            enrollmentData.course = courseId;
        }

        const enrollment = await Enrollment.create(enrollmentData);

        res.status(201).json({ success: true, data: enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all published notes with details
// @route   GET /api/public/notes
// @access  Public
const getAllPublishedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ isPublished: true })
            .populate({
                path: 'chapter',
                populate: {
                    path: 'subject',
                    populate: {
                        path: 'course'
                    }
                }
            })
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPublishedCourses,
    getCourseDetails,
    getChapterContent,
    searchCourses,
    getVideoById,
    enrollStudent,
    getAllPublishedNotes
};
