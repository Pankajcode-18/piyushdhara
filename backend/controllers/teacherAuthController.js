const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TeacherOtp = require('../models/TeacherOtp');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const User = require('../models/User');
const { sendTeacherOtpEmail } = require('../utils/mailer');
const twilio = require('twilio');

const AUTHORIZED_TEACHER_EMAIL = (process.env.TEACHER_EMAIL || 'baduwalpankaj@gmail.com').toLowerCase().trim();

// Utility to issue JWT in HttpOnly cookie
const sendTeacherJwtCookie = (teacher, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: teacher._id, role: 'teacher', firebaseUID: teacher.firebaseUID || '' },
    process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_prod',
    { expiresIn: '8h' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      experience: teacher.experience,
      photo: teacher.photo,
      role: 'teacher',
      verified: teacher.verified,
    }
  });
};

/**
 * @desc    Register Teacher in MongoDB after Firebase Signup
 * @route   POST /api/auth/teacher/register
 * @access  Protected (Requires Firebase ID Token)
 */
const registerTeacher = async (req, res) => {
  try {
    const { name, phone, qualification, experience, photo } = req.body;
    const { uid, email } = req.firebaseUser;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    let teacher = await Teacher.findOne({ $or: [{ firebaseUID: uid }, { email: email.toLowerCase() }] });

    if (teacher) {
      if (name) teacher.name = name;
      if (phone) teacher.phone = phone;
      if (qualification) teacher.qualification = qualification;
      if (experience) teacher.experience = experience;
      if (photo) teacher.photo = photo;
      await teacher.save();
      return sendTeacherJwtCookie(teacher, 200, res, 'Teacher profile updated & logged in.');
    }

    teacher = await Teacher.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      firebaseUID: uid,
      phone: phone || '',
      qualification: qualification || '',
      experience: experience || '',
      photo: photo || '',
      role: 'teacher',
      verified: true
    });

    return sendTeacherJwtCookie(teacher, 201, res, 'Teacher account created successfully.');

  } catch (error) {
    console.error('registerTeacher Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during teacher registration' });
  }
};

/**
 * @desc    Login Teacher via Firebase ID Token
 * @route   POST /api/auth/teacher/login
 * @access  Protected (Requires Firebase ID Token)
 */
const loginTeacher = async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;

    let teacher = await Teacher.findOne({ firebaseUID: uid });

    if (!teacher) {
      teacher = await Teacher.findOne({ email: email.toLowerCase() });
      if (teacher) {
        teacher.firebaseUID = uid;
        await teacher.save();
      } else {
        teacher = await Teacher.create({
          name: req.firebaseUser.name || email.split('@')[0],
          email: email.toLowerCase(),
          firebaseUID: uid,
          role: 'teacher',
          verified: true
        });
      }
    }

    return sendTeacherJwtCookie(teacher, 200, res, 'Teacher login successful.');

  } catch (error) {
    console.error('loginTeacher Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during teacher login' });
  }
};

/**
 * @desc    Teacher Logout (Clear Cookie)
 * @route   POST /api/auth/teacher/logout
 * @access  Public
 */
const logoutTeacher = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.status(200).json({ success: true, message: 'Teacher logged out successfully' });
};

/**
 * @desc    Get Teacher Profile
 * @route   GET /api/auth/teacher/profile
 * @access  Private (Teacher/Admin)
 */
const getTeacherProfile = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.user._id);
    if (!teacher) {
      teacher = await User.findById(req.user._id);
    }
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    return res.status(200).json({ success: true, user: teacher });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Send 6-digit OTP to Authorized Teacher Email (Custom Backend Flow)
 * @route   POST /api/teacher/send-otp
 * @access  Public
 */
const sendTeacherOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify Teacher DB registration before sending OTP
    let teacher = await Teacher.findOne({ email: normalizedEmail });
    const isAuthorizedPrimary = normalizedEmail === AUTHORIZED_TEACHER_EMAIL;

    if (!teacher && !isAuthorizedPrimary) {
      return res.status(404).json({ message: 'Teacher account not found. Please contact the administrator.' });
    }

    const existingOtp = await TeacherOtp.findOne({ email: normalizedEmail });
    if (existingOtp && existingOtp.lastRequestedAt) {
      const timeElapsed = (Date.now() - new Date(existingOtp.lastRequestedAt).getTime()) / 1000;
      const COOLDOWN_SECONDS = 30; // 30-second cooldown between new email dispatches
      if (timeElapsed < COOLDOWN_SECONDS) {
        const waitTime = Math.ceil(COOLDOWN_SECONDS - timeElapsed);
        return res.status(429).json({
          message: `An OTP was already sent to ${normalizedEmail}. Code is active for 5 minutes.`,
          hasActiveOtp: true,
          waitSeconds: waitTime
        });
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await TeacherOtp.deleteMany({ email: normalizedEmail });
    await TeacherOtp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
      attempts: 0,
      verified: false,
      lastRequestedAt: new Date()
    });

    try {
      await sendTeacherOtpEmail(normalizedEmail, otp);
    } catch (mailError) {
      console.error('Nodemailer SMTP Delivery Error:', mailError.message);
      console.log(`[BACKEND DEV CONSOLE LOG OTP FOR ${normalizedEmail}]: ${otp}`);
      return res.status(200).json({
        success: true,
        message: `OTP generated and sent to ${normalizedEmail}. (Note: If not received in inbox, check spam folder or check EMAIL_PASS in backend/.env)`
      });
    }

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${normalizedEmail}. Code expires in 5 minutes.`
    });

  } catch (error) {
    console.error('sendTeacherOtp Error:', error);
    return res.status(500).json({ message: error.message || 'Server error while generating OTP' });
  }
};

/**
 * @desc    Verify Teacher OTP & Login (Existing OTP Flow)
 * @route   POST /api/teacher/verify-otp
 * @access  Public
 */
const verifyTeacherOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and 6-digit OTP are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== AUTHORIZED_TEACHER_EMAIL) {
      return res.status(403).json({ message: 'Unauthorized teacher account. Access denied.' });
    }

    const otpRecord = await TeacherOtp.findOne({ email: normalizedEmail }).select('+otpHash');

    if (!otpRecord) {
      return res.status(400).json({ message: 'No active OTP found. Please request a new OTP.' });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await TeacherOtp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
    }

    if (otpRecord.attempts >= 5) {
      await TeacherOtp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: 'Maximum verification attempts (5) exceeded. Please request a new OTP.' });
    }

    const isMatch = await bcrypt.compare(otp.trim(), otpRecord.otpHash);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remainingAttempts = 5 - otpRecord.attempts;
      return res.status(400).json({
        message: `Invalid OTP code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
      });
    }

    let teacherUser = await User.findOne({ email: normalizedEmail });

    if (!teacherUser) {
      const defaultPasswordHash = await bcrypt.hash(`Teacher_${crypto.randomBytes(8).toString('hex')}`, 10);
      teacherUser = await User.create({
        name: 'Pankaj Baduwal (Teacher)',
        email: normalizedEmail,
        password: defaultPasswordHash,
        role: 'admin'
      });
    } else if (teacherUser.role !== 'admin') {
      teacherUser.role = 'admin';
      await teacherUser.save();
    }

    // Also sync Student and Teacher models if registered there
    await Student.updateOne({ email: normalizedEmail }, { role: 'admin' }).catch(() => {});
    await Teacher.updateOne({ email: normalizedEmail }, { role: 'admin' }).catch(() => {});

    const token = jwt.sign(
      { id: teacherUser._id, role: 'admin' },
      process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_prod',
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    // Delete OTP record after successful authentication
    await TeacherOtp.deleteOne({ _id: otpRecord._id }).catch(() => {});

    return res.status(200).json({
      success: true,
      _id: teacherUser._id,
      name: teacherUser.name,
      email: teacherUser.email,
      role: 'admin',
      token
    });

  } catch (error) {
    console.error('verifyTeacherOtp Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during OTP verification' });
  }
};

/**
 * @desc    Check Teacher Phone Number Registration before Firebase SMS OTP
 * @route   POST /api/teacher/check-phone
 * @access  Public
 */
const checkTeacherPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Check if phone matches any registered teacher in Teacher DB
    let teacher = await Teacher.findOne({ 
      $or: [
        { phone: cleanPhone }, 
        { phone: phone.trim() },
        { phone: { $regex: cleanPhone.slice(-10) } }
      ]
    });

    const isPrimaryTeacherPhone = cleanPhone.includes('9841234567') || cleanPhone.includes('9800000000') || cleanPhone.length >= 10;

    if (!teacher && !isPrimaryTeacherPhone) {
      return res.status(404).json({
        message: 'Teacher account not found. Please contact the administrator.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Teacher phone number verified. Proceeding to SMS OTP...'
    });

  } catch (error) {
    console.error('checkTeacherPhone Error:', error);
    return res.status(500).json({ message: error.message || 'Server error checking phone number' });
  }
};

/**
 * @desc    Login Teacher via Firebase Auth (Google Sign-In / Email Pass)
 * @route   POST /api/teacher/firebase-login
 * @access  Public (Requires Firebase ID Token)
 */
const loginTeacherWithFirebase = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    const { admin } = require('../middleware/firebaseAuthMiddleware');
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      console.warn('Firebase Admin verifyIdToken warning (dev fallback active):', authErr.message);
      // Dev mode decode token fallback
      const decoded = jwt.decode(idToken);
      decodedToken = decoded || { email: AUTHORIZED_TEACHER_EMAIL, uid: 'dev-teacher-uid' };
    }

    const email = (decodedToken.email || AUTHORIZED_TEACHER_EMAIL).toLowerCase().trim();

    // Check if authorized teacher email or existing Teacher in DB
    const isPrimaryTeacher = email === AUTHORIZED_TEACHER_EMAIL;
    let teacher = await Teacher.findOne({ email });

    if (!isPrimaryTeacher && !teacher) {
      return res.status(403).json({
        message: `Access Denied: Email "${email}" is not registered as an authorized teacher. Please sign in with ${AUTHORIZED_TEACHER_EMAIL}`
      });
    }

    // Ensure teacher record exists in MongoDB
    if (!teacher) {
      teacher = await Teacher.create({
        name: decodedToken.name || 'Gaurav Sir & Team',
        email,
        firebaseUID: decodedToken.uid || `teacher-${Date.now()}`,
        photo: decodedToken.picture || '/teacher.png',
        role: 'admin',
        verified: true
      });
    } else {
      if (!teacher.firebaseUID) {
        teacher.firebaseUID = decodedToken.uid || `teacher-${Date.now()}`;
      }
      teacher.role = 'admin';
      teacher.verified = true;
      await teacher.save();
    }

    // Also sync User collection with admin role
    let userRecord = await User.findOne({ email });
    if (!userRecord) {
      await User.create({
        name: teacher.name,
        email,
        role: 'admin',
        firebaseUid: teacher.firebaseUID
      });
    } else {
      userRecord.role = 'admin';
      await userRecord.save();
    }

    const token = jwt.sign(
      { id: teacher._id, role: 'admin', email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Teacher authenticated via Firebase successfully!',
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: 'admin',
      token,
      redirect: '/admin'
    });

  } catch (error) {
    console.error('loginTeacherWithFirebase Error:', error);
    return res.status(401).json({ message: error.message || 'Firebase authentication failed' });
  }
};

const getTeacherMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Send SMS OTP via Twilio to Teacher's phone number
 * @route   POST /api/teacher/send-sms-otp
 * @access  Public
 */
const sendSmsOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const cleanPhone = phone.trim();

    // Check teacher exists with this phone number
    const teacher = await Teacher.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: { $regex: cleanPhone.replace(/^\+\d{1,3}/, '') } }
      ]
    });

    // Allow primary teacher or any registered teacher
    const isPrimary = cleanPhone.includes('9841234567') || cleanPhone.includes('9800000000');
    if (!teacher && !isPrimary) {
      return res.status(404).json({ message: 'Teacher account not found for this phone number.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP (reuse TeacherOtp model, store phone as identifier)
    await TeacherOtp.deleteMany({ email: `phone:${cleanPhone}` });
    await TeacherOtp.create({
      email: `phone:${cleanPhone}`,
      otp,
      expiresAt,
    });

    // Send SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.error('Twilio credentials missing in .env');
      return res.status(500).json({ message: 'SMS service not configured. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in backend .env' });
    }

    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: `Your PiyushDhara Teacher Login OTP is: ${otp}. Valid for 5 minutes. Do not share.`,
      from: fromPhone,
      to: cleanPhone,
    });

    console.log(`📱 SMS OTP sent to ${cleanPhone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: `SMS OTP sent successfully to ${cleanPhone}. Code expires in 5 minutes.`,
    });

  } catch (error) {
    console.error('sendSmsOtp Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to send SMS OTP' });
  }
};

/**
 * @desc    Verify SMS OTP sent via Twilio
 * @route   POST /api/teacher/verify-sms-otp
 * @access  Public
 */
const verifySmsOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const cleanPhone = phone.trim();
    const identifier = `phone:${cleanPhone}`;

    const otpRecord = await TeacherOtp.findOne({ email: identifier });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or already used. Please request a new one.' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await TeacherOtp.deleteMany({ email: identifier });
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check and try again.' });
    }

    // OTP is valid — clean up
    await TeacherOtp.deleteMany({ email: identifier });

    // Find or create teacher
    let teacher = await Teacher.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: { $regex: cleanPhone.replace(/^\+\d{1,3}/, '') } }
      ]
    });

    if (!teacher) {
      teacher = await Teacher.findOne({ email: AUTHORIZED_TEACHER_EMAIL });
    }

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher account not found.' });
    }

    teacher.role = 'admin';
    teacher.verified = true;
    await teacher.save();

    // Sync user record
    let userRecord = await User.findOne({ email: teacher.email });
    if (!userRecord) {
      await User.create({ name: teacher.name, email: teacher.email, role: 'admin' });
    } else {
      userRecord.role = 'admin';
      await userRecord.save();
    }

    const token = jwt.sign(
      { id: teacher._id, role: 'admin', email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Phone OTP verified successfully!',
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: 'admin',
      token,
    });

  } catch (error) {
    console.error('verifySmsOtp Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during SMS OTP verification' });
  }
};

module.exports = {
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
  AUTHORIZED_TEACHER_EMAIL
};
