const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user across Student, Teacher, or User models
      let user = await Student.findById(decoded.id).select('-password');
      if (!user) user = await Teacher.findById(decoded.id).select('-password');
      if (!user) user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth protection token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
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
