const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const Note = require('../models/Note');
const Enrollment = require('../models/Enrollment');
const Visitor = require('../models/Visitor');
const User = require('../models/User');

// @desc    Get all published courses
// @route   GET /api/public/courses
// @access  Public
const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).sort({ order: 1 });
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
        const course = await Course.findOne({ _id: req.params.id, isPublished: true });
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

// @desc    Record visitor count (Total & Today)
// @route   POST /api/public/visitor
// @access  Public
const recordVisitorCount = async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        let todayRecord = await Visitor.findOne({ date: todayStr });
        if (!todayRecord) {
            todayRecord = await Visitor.create({ date: todayStr, todayVisits: 1 });
        } else {
            todayRecord.todayVisits += 1;
            await todayRecord.save();
        }

        // Aggregate total visits across all records (plus base seed for realism)
        const totalVisitsAggregate = await Visitor.aggregate([
            { $group: { _id: null, total: { $sum: '$todayVisits' } } }
        ]);

        const totalVisits = (totalVisitsAggregate[0]?.total || 0) + 1250;

        res.json({
            todayVisits: todayRecord.todayVisits,
            totalVisits
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current visitor statistics
// @route   GET /api/public/visitor-stats
// @access  Public
const getVisitorStats = async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = await Visitor.findOne({ date: todayStr });

        const totalVisitsAggregate = await Visitor.aggregate([
            { $group: { _id: null, total: { $sum: '$todayVisits' } } }
        ]);

        const totalVisits = (totalVisitsAggregate[0]?.total || 0) + 1250;

        res.json({
            todayVisits: todayRecord ? todayRecord.todayVisits : 1,
            totalVisits
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record daily study streak for student
// @route   POST /api/public/streak
// @access  Public
const recordStudyStreak = async (req, res) => {
    try {
        const { userId, currentStreak } = req.body;
        const todayStr = new Date().toISOString().split('T')[0];

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

        let newStreak = 1;

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                if (user.lastStudyDate === todayStr) {
                    newStreak = user.streakCount || 1;
                } else if (user.lastStudyDate === yesterdayStr) {
                    newStreak = (user.streakCount || 0) + 1;
                } else {
                    newStreak = 1;
                }
                user.streakCount = newStreak;
                user.lastStudyDate = todayStr;
                await user.save();
                return res.json({ streakCount: newStreak, lastStudyDate: todayStr });
            }
        }

        // Guest logic (or fallback)
        if (currentStreak) {
            newStreak = Number(currentStreak) + 1;
        }

        res.json({ streakCount: newStreak, lastStudyDate: todayStr });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Default Seed Teachers List if DB is empty
const DEFAULT_TEACHERS = [
  {
    _id: '6a6111111111111111111111',
    name: 'Gaurav Sir & Team',
    designation: 'Senior Lead Educator & Entrance Specialist',
    qualification: 'M.Sc. Mathematics & Physics Specialist',
    experience: '10+ Years',
    bio: 'Legendary mathematics & physics educator leading PiyushDhara with over 10+ years of experience simplifying SEE, NEB, and IOE entrance concepts for 15,000+ students across Nepal.',
    specializations: ['Mahabharath Math', 'NEB Physics', 'IOE Entrance'],
    photo: '/teacher.png',
    rating: 4.9,
    studentsMentored: '15,000+',
    verified: true,
  },
  {
    _id: '6a6222222222222222222222',
    name: 'Er. Pankaj Baduwal',
    designation: 'Senior Engineering & Computer Science Lecturer',
    qualification: 'B.E. Computer Engineering, IOE Rank Holder',
    experience: '7+ Years',
    bio: 'Tech lead & senior lecturer specializing in Web Development, Computer Engineering routines, and IOE entrance numerical shortcuts.',
    specializations: ['Full-Stack Web Dev', 'IOE Computer Science', 'Physics'],
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    studentsMentored: '8,500+',
    verified: true,
  },
  {
    _id: '6a6333333333333333333333',
    name: 'Dr. A. Sharma',
    designation: 'Senior Chemistry & Entrance Consultant',
    qualification: 'Ph.D. Organic Chemistry',
    experience: '12+ Years',
    bio: 'Dedicated chemistry specialist renowned for simplifying organic reaction mechanisms, physical chemistry formulas, and NEB board preparation.',
    specializations: ['Organic Chemistry', 'Physical Chemistry', 'NEB Board Exams'],
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    studentsMentored: '6,200+',
    verified: true,
  }
];

// @desc Get list of public teacher profiles
// @route GET /api/public/teachers
// @access Public
const getPublicTeachers = async (req, res) => {
  try {
    const Teacher = require('../models/Teacher');
    const teachers = await Teacher.find({}).sort({ createdAt: -1 });
    if (!teachers || teachers.length === 0) {
      return res.json(DEFAULT_TEACHERS);
    }
    res.json(teachers);
  } catch (error) {
    res.json(DEFAULT_TEACHERS);
  }
};

// @desc Create or Update Teacher Profile (Admin)
// @route POST /api/public/teachers
// @access Public / Admin
const createTeacherProfile = async (req, res) => {
  try {
    const Teacher = require('../models/Teacher');
    const { name, designation, qualification, experience, bio, specializations, photo } = req.body;
    if (!name) return res.status(400).json({ message: 'Teacher name is required' });

    const newTeacher = await Teacher.create({
      name,
      designation: designation || 'Educator',
      qualification: qualification || 'Master Degree',
      experience: experience || '5+ Years',
      bio: bio || 'Dedicated educator at PiyushDhara.',
      specializations: Array.isArray(specializations) ? specializations : (specializations ? specializations.split(',') : []),
      photo: photo || '/teacher.png',
      firebaseUID: `manual-${Date.now()}`,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@piyushdhara.edu.np`,
      verified: true
    });

    res.status(201).json(newTeacher);
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
    getAllPublishedNotes,
    recordVisitorCount,
    getVisitorStats,
    recordStudyStreak,
    getPublicTeachers,
    createTeacherProfile
};
