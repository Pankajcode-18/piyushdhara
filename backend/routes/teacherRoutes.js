const express = require('express');
const router = express.Router();
const {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  getTeacherProfile,
  sendTeacherOtp,
  verifyTeacherOtp,
  checkTeacherPhone,
  loginTeacherWithFirebase,
  getTeacherMe,
  sendSmsOtp,
  verifySmsOtp,
} = require('../controllers/teacherAuthController');
const { verifyFirebaseToken } = require('../middleware/firebaseAuthMiddleware');
const { protectJwt, authorizeRoles } = require('../middleware/jwtCookieMiddleware');

// Firebase Teacher Auth Endpoints
router.post('/register', verifyFirebaseToken, registerTeacher);
router.post('/login', verifyFirebaseToken, loginTeacher);
router.post('/firebase-login', loginTeacherWithFirebase);
router.post('/logout', logoutTeacher);
router.get('/profile', protectJwt, authorizeRoles('teacher', 'admin'), getTeacherProfile);

// Email OTP Routes
router.post('/send-otp', sendTeacherOtp);
router.post('/verify-otp', verifyTeacherOtp);
router.post('/check-phone', checkTeacherPhone);
router.get('/me', protectJwt, getTeacherMe);

// Twilio SMS OTP Routes
router.post('/send-sms-otp', sendSmsOtp);
router.post('/verify-sms-otp', verifySmsOtp);

module.exports = router;

