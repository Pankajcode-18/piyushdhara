const Student = require('../models/Student');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Add bookmark
// @route   POST /api/student/bookmarks
// @access  Private
const addBookmark = async (req, res) => {
  try {
    const { id } = req.body;
    let user = await Student.findById(req.user._id);
    if (!user) user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.bookmarks) user.bookmarks = [];

    if (!user.bookmarks.includes(id)) {
      user.bookmarks.push(id);
      await user.save();
    }

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/student/bookmarks/:id
// @access  Private
const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await Student.findById(req.user._id);
    if (!user) user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bookmarks = (user.bookmarks || []).filter(b => b.toString() !== id);
    await user.save();

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    One-Click Course Enrollment
// @route   POST /api/student/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'Please provide a valid courseId' });
    }

    const courseObj = await Course.findById(courseId);
    if (!courseObj) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let user = await Student.findById(req.user._id);
    if (!user) user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Student account not found' });
    }

    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    const isAlreadyEnrolled = user.enrolledCourses.some(
      (cId) => cId.toString() === courseId.toString()
    );

    if (!isAlreadyEnrolled) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    let existingEnrollment = await Enrollment.findOne({
      $or: [
        { student: user._id, course: courseId },
        { email: user.email ? user.email.toLowerCase() : '', course: courseId }
      ]
    });

    if (!existingEnrollment) {
      existingEnrollment = await Enrollment.create({
        student: user._id,
        course: courseId,
        name: user.name || 'Student',
        email: user.email,
        phone: user.phone || '',
        school: user.school || 'N/A',
        enrolledAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enrolled in course successfully',
      enrolledCourses: user.enrolledCourses,
      enrollment: existingEnrollment
    });

  } catch (error) {
    console.error('enrollCourse Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during course enrollment' });
  }
};

// @desc    Get user enrolled courses
// @route   GET /api/student/my-courses
// @access  Private
const getEnrolledCourses = async (req, res) => {
  try {
    let user = await Student.findById(req.user._id);
    if (!user) user = await User.findById(req.user._id);

    const rawCourseIds = user?.enrolledCourses || [];
    const courseIdSet = new Set(rawCourseIds.map(id => id.toString()));

    // Also fetch courses from Enrollment collection
    if (req.user) {
      const query = [];
      if (req.user._id) query.push({ student: req.user._id });
      if (req.user.email) query.push({ email: req.user.email.toLowerCase() });

      if (query.length > 0) {
        const enrollments = await Enrollment.find({ $or: query });
        enrollments.forEach((e) => {
          if (e.course) {
            courseIdSet.add(e.course.toString());
          }
        });
      }
    }

    const uniqueCourseIds = Array.from(courseIdSet);

    if (uniqueCourseIds.length === 0) {
      return res.json([]);
    }

    const fullCourses = await Course.find({ _id: { $in: uniqueCourseIds } });

    return res.json(fullCourses);

  } catch (error) {
    console.error('getEnrolledCourses Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  enrollCourse,
  getEnrolledCourses,
};
