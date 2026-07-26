const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

/**
 * Protect routes using JWT stored in HttpOnly cookie or Authorization header
 */
const protectJwt = async (req, res, next) => {
  let token;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in Student, Teacher, or User models
    let user = await Student.findById(decoded.id);
    if (!user) user = await Teacher.findById(decoded.id);
    if (!user) user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Protection Error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Restrict routes to specific roles (e.g., 'student', 'teacher', 'admin')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user?.role || 'guest'}) is not allowed to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  protectJwt,
  authorizeRoles,
};
