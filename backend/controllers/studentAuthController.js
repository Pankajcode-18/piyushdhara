const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Utility to calculate profile completion percentage & badges
const calculateCompletionStats = (student) => {
  const fields = [
    { key: 'accountCreated', label: 'Basic Account Created', isDone: true, weight: 20 },
    { key: 'phone', label: 'Phone Number Added', isDone: Boolean(student.phone && student.phone.trim()), weight: 15 },
    { key: 'photo', label: 'Profile Photo Uploaded', isDone: Boolean(student.photo && student.photo.trim()), weight: 15 },
    { key: 'personalDetails', label: 'Personal Details Completed', isDone: Boolean(student.gender || student.dob || student.city || student.address), weight: 20 },
    { key: 'academicDetails', label: 'Academic Details Added', isDone: Boolean(student.school || student.grade || student.board), weight: 15 },
    { key: 'interests', label: 'Interests & Goals Selected', isDone: Boolean((student.interests && student.interests.length > 0) || student.learningGoals || student.bio), weight: 15 }
  ];

  const percentage = fields.reduce((acc, f) => acc + (f.isDone ? f.weight : 0), 0);

  const enrolledCount = student.enrolledCourses ? student.enrolledCourses.length : 0;
  let badge = 'New Student';
  if (enrolledCount >= 3 || (student.streakCount || 0) >= 7 || percentage >= 80) {
    badge = 'Dedicated Learner';
  } else if (enrolledCount >= 1 || percentage >= 50) {
    badge = 'Active Learner';
  }

  return { percentage, badge, checklist: fields };
};

// Utility to generate JWT token & set HttpOnly cookie
const sendJwtCookie = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role, firebaseUID: user.firebaseUID },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  const stats = calculateCompletionStats(user);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      ...user.toObject(),
      completionStats: stats
    }
  });
};

/**
 * @desc    Register Student in MongoDB after Firebase Signup
 * @route   POST /api/auth/student/register
 * @access  Protected (Requires Firebase ID Token)
 */
const registerStudent = async (req, res) => {
  try {
    const { name, photo } = req.body;
    const { uid, email, email_verified } = req.firebaseUser;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    let student = await Student.findOne({ $or: [{ firebaseUID: uid }, { email: email.toLowerCase() }] });

    if (student) {
      student.emailVerified = email_verified || student.emailVerified;
      if (name) student.name = name;
      if (photo) student.photo = photo;
      await student.save();
      return sendJwtCookie(student, 200, res, 'Student account already exists. Logged in successfully.');
    }

    student = await Student.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      photo: photo || '',
      firebaseUID: uid,
      role: 'student',
      provider: 'password',
      emailVerified: email_verified || false,
    });

    return sendJwtCookie(student, 201, res, 'Student registered successfully in database.');

  } catch (error) {
    console.error('registerStudent Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during student registration' });
  }
};

/**
 * @desc    Login Student after Firebase authentication
 * @route   POST /api/auth/student/login
 * @access  Protected (Requires Firebase ID Token)
 */
const loginStudent = async (req, res) => {
  try {
    const { uid, email, email_verified } = req.firebaseUser;

    let student = await Student.findOne({ firebaseUID: uid });

    if (!student) {
      student = await Student.findOne({ email: email.toLowerCase() });
      if (student) {
        student.firebaseUID = uid;
        student.emailVerified = email_verified || student.emailVerified;
        await student.save();
      } else {
        student = await Student.create({
          name: req.firebaseUser.name || email.split('@')[0],
          email: email.toLowerCase(),
          photo: req.firebaseUser.picture || '',
          firebaseUID: uid,
          role: 'student',
          provider: 'password',
          emailVerified: email_verified || false,
        });
      }
    } else {
      student.emailVerified = email_verified || student.emailVerified;
      await student.save();
    }

    return sendJwtCookie(student, 200, res, 'Student authenticated successfully.');

  } catch (error) {
    console.error('loginStudent Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during student login' });
  }
};

/**
 * @desc    Google Sign-In for Student
 * @route   POST /api/auth/student/google
 * @access  Protected (Requires Firebase ID Token)
 */
const googleStudentLogin = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.firebaseUser;

    if (!email) {
      return res.status(400).json({ message: 'Google account must have an email address' });
    }

    let student = await Student.findOne({ firebaseUID: uid });

    if (!student) {
      student = await Student.findOne({ email: email.toLowerCase() });
      if (student) {
        student.firebaseUID = uid;
        student.provider = 'google';
        student.emailVerified = true;
        if (picture) student.photo = picture;
        await student.save();
      } else {
        student = await Student.create({
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          photo: picture || '',
          firebaseUID: uid,
          role: 'student',
          provider: 'google',
          emailVerified: true,
        });
      }
    } else {
      student.emailVerified = true;
      if (picture && !student.photo) student.photo = picture;
      await student.save();
    }

    return sendJwtCookie(student, 200, res, 'Google login successful.');

  } catch (error) {
    console.error('googleStudentLogin Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during Google login' });
  }
};

/**
 * @desc    Student Logout
 * @route   POST /api/auth/student/logout
 * @access  Public
 */
const logoutStudent = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * @desc    Get Current Student Profile
 * @route   GET /api/auth/student/profile
 * @access  Private (JWT Cookie / Protect)
 */
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Generate student ID if missing
    if (!student.studentId) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      student.studentId = `PD-STUDENT-${randomDigits}`;
      await student.save();
    }

    // Consolidate enrolled course IDs across Student & Enrollment collections
    const courseIdSet = new Set((student.enrolledCourses || []).map(id => id.toString()));

    const query = [];
    if (student._id) query.push({ student: student._id });
    if (student.email) query.push({ email: student.email.toLowerCase() });

    if (query.length > 0) {
      const enrollments = await Enrollment.find({ $or: query });
      enrollments.forEach((e) => {
        if (e.course) courseIdSet.add(e.course.toString());
      });
    }

    const uniqueIds = Array.from(courseIdSet);
    const fullCourses = await Course.find({ _id: { $in: uniqueIds } });

    const stats = calculateCompletionStats({
      ...student.toObject(),
      enrolledCourses: fullCourses
    });

    return res.status(200).json({
      success: true,
      user: {
        ...student.toObject(),
        enrolledCourses: fullCourses,
        completionStats: stats
      }
    });
  } catch (error) {
    console.error('getStudentProfile Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update Student Profile (Personal, Academic, Learning & Photo)
 * @route   PUT /api/auth/student/profile
 * @access  Private (JWT Cookie / Protect)
 */
const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const {
      name,
      photo,
      phone,
      gender,
      dob,
      address,
      city,
      state,
      country,
      postalCode,
      school,
      grade,
      board,
      stream,
      graduationYear,
      interests,
      skills,
      favoriteSubjects,
      learningGoals,
      careerPlan,
      dreamCollege,
      dreamJob,
      bio
    } = req.body;

    if (name !== undefined) student.name = name;
    if (photo !== undefined) student.photo = photo;
    if (phone !== undefined) student.phone = phone;
    if (gender !== undefined) student.gender = gender;
    if (dob !== undefined) student.dob = dob;
    if (address !== undefined) student.address = address;
    if (city !== undefined) student.city = city;
    if (state !== undefined) student.state = state;
    if (country !== undefined) student.country = country;
    if (postalCode !== undefined) student.postalCode = postalCode;

    if (school !== undefined) student.school = school;
    if (grade !== undefined) student.grade = grade;
    if (board !== undefined) student.board = board;
    if (stream !== undefined) student.stream = stream;
    if (graduationYear !== undefined) student.graduationYear = graduationYear;

    if (interests !== undefined) student.interests = Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim()).filter(Boolean);
    if (skills !== undefined) student.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    if (favoriteSubjects !== undefined) student.favoriteSubjects = Array.isArray(favoriteSubjects) ? favoriteSubjects : favoriteSubjects.split(',').map(s => s.trim()).filter(Boolean);

    if (learningGoals !== undefined) student.learningGoals = learningGoals;
    if (careerPlan !== undefined) student.careerPlan = careerPlan;
    if (dreamCollege !== undefined) student.dreamCollege = dreamCollege;
    if (dreamJob !== undefined) student.dreamJob = dreamJob;
    if (bio !== undefined) student.bio = bio;

    // Handle photo file upload if provided
    if (req.file) {
      student.photo = `/uploads/${req.file.filename}`;
    }

    await student.save();

    const populatedStudent = await Student.findById(student._id).populate('enrolledCourses');

    const stats = calculateCompletionStats(populatedStudent);

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully!',
      user: {
        ...populatedStudent.toObject(),
        completionStats: stats
      }
    });

  } catch (error) {
    console.error('updateStudentProfile Error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating student profile' });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  googleStudentLogin,
  logoutStudent,
  getStudentProfile,
  updateStudentProfile,
};
