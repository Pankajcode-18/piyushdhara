const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ order: 1 });
        const coursesWithEnrollCount = await Promise.all(courses.map(async (course) => {
            const enrollCount = await Enrollment.countDocuments({ course: course._id });
            return {
                ...course._doc,
                enrollCount
            };
        }));
        res.json(coursesWithEnrollCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    try {
        const { title, description, price, isPublished, isFeatured, order, instructorName } = req.body;
        
        let thumbnailUrl = req.body.thumbnailUrl || 'no-photo.jpg';
        let teacherImageUrl = req.body.teacherImageUrl || '/teacher.png';

        if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
            thumbnailUrl = `http://localhost:5000/uploads/${req.files.thumbnail[0].filename}`;
        }
        if (req.files && req.files.teacherImage && req.files.teacherImage[0]) {
            teacherImageUrl = `http://localhost:5000/uploads/${req.files.teacherImage[0].filename}`;
        }

        const course = new Course({
            title,
            description,
            price: price !== undefined ? Number(price) : 0,
            isPublished: isPublished === 'true' || isPublished === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            order: order !== undefined ? Number(order) : 0,
            instructorName: instructorName || 'Gaurav Sir & Team',
            teacherImageUrl,
            thumbnailUrl
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            course.title = req.body.title || course.title;
            course.description = req.body.description || course.description;
            if (req.body.price !== undefined) course.price = Number(req.body.price);
            if (req.body.isPublished !== undefined) course.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
            if (req.body.isFeatured !== undefined) course.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
            if (req.body.order !== undefined) course.order = Number(req.body.order);
            if (req.body.instructorName !== undefined) course.instructorName = req.body.instructorName;

            if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
                course.thumbnailUrl = `http://localhost:5000/uploads/${req.files.thumbnail[0].filename}`;
            } else if (req.body.thumbnailUrl) {
                course.thumbnailUrl = req.body.thumbnailUrl;
            }

            if (req.files && req.files.teacherImage && req.files.teacherImage[0]) {
                course.teacherImageUrl = `http://localhost:5000/uploads/${req.files.teacherImage[0].filename}`;
            } else if (req.body.teacherImageUrl) {
                course.teacherImageUrl = req.body.teacherImageUrl;
            }

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            await Course.deleteOne({ _id: course._id });
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
