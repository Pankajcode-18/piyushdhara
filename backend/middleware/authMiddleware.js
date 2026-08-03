const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;
  let emailHeader = req.headers['x-student-email'] || req.query.studentEmail;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token && token !== 'undefined' && token !== 'null') {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_prod');

      const targetId = decoded.id || decoded._id || decoded.userId;
      let user = null;

      if (targetId && mongoose.Types.ObjectId.isValid(targetId)) {
        user = await Student.findById(targetId).select('-password') ||
               await Teacher.findById(targetId).select('-password') ||
               await User.findById(targetId).select('-password');
      }

      if (!user && decoded.email) {
        const cleanEmail = decoded.email.toLowerCase().trim();
        user = await Student.findOne({ email: cleanEmail }).select('-password') ||
               await User.findOne({ email: cleanEmail }).select('-password') ||
               await Teacher.findOne({ email: cleanEmail }).select('-password');
      }

      if (!user && decoded.firebaseUID) {
        user = await Student.findOne({ firebaseUID: decoded.firebaseUID }).select('-password') ||
               await User.findOne({ firebaseUID: decoded.firebaseUID }).select('-password');
      }

      // Auto-upsert student record if token email exists but user record is missing in DB
      if (!user && decoded.email) {
        const cleanEmail = decoded.email.toLowerCase().trim();
        user = await Student.create({
          name: decoded.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          firebaseUID: decoded.firebaseUID || null
        });
      }

      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.warn('Auth token verification notice:', error.message);
    }
  }

  // Fallback: Check emailHeader or req.body.studentEmail or req.body.email if token is missing/expired
  if (!emailHeader && req.body && (req.body.studentEmail || req.body.email)) {
    emailHeader = req.body.studentEmail || req.body.email;
  }

  if (emailHeader) {
    const cleanEmail = emailHeader.toLowerCase().trim();
    let user = await Student.findOne({ email: cleanEmail }).select('-password') ||
               await User.findOne({ email: cleanEmail }).select('-password') ||
               await Teacher.findOne({ email: cleanEmail }).select('-password');

    if (!user) {
      user = await Student.create({
        name: cleanEmail.split('@')[0],
        email: cleanEmail
      });
    }

    if (user) {
      req.user = user;
      return next();
    }
  }

  return res.status(401).json({ message: 'User not found. Please log in to post.' });
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin/teacher' });
  }
};

const teacherProtect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_prod');
      
      let user = await Teacher.findById(decoded.id).select('-password');
      if (!user) user = await User.findById(decoded.id).select('-password');

      if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
        return res.status(403).json({ message: 'Access denied. Teacher privileges required.' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('teacherProtect Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized as Teacher, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized as Teacher, no token provided' });
};

module.exports = { protect, admin, teacherProtect };
