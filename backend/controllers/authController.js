const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || (!phone && !email) || !password) {
            return res.status(400).json({ message: 'Please provide a name, phone/email, and password' });
        }

        const query = [];
        if (phone) query.push({ phone });
        if (email) query.push({ email });

        const userExists = await User.findOne({ $or: query });
        if (userExists) {
            return res.status(400).json({ message: 'User with this phone or email already exists' });
        }

        const user = await User.create({
            name,
            phone: phone || undefined,
            email: email || undefined,
            password,
            role: 'student'
        });

        if (user) {
            const token = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            user.refreshToken = refreshToken;
            await user.save();

            res.status(201).json({
                _id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                enrolledCourses: user.enrolledCourses || [],
                token,
                refreshToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (Admin or Student) by Name, Phone, or Email
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { identifier, email, phone, password } = req.body;
        const searchKey = identifier || email || phone;

        if (!searchKey || !password) {
            return res.status(400).json({ message: 'Please provide login credentials and password' });
        }

        // Search user by name, phone, or email (case insensitive regex for name)
        const user = await User.findOne({
            $or: [
                { phone: searchKey },
                { email: searchKey },
                { name: { $regex: new RegExp(`^${searchKey.trim()}$`, 'i') } }
            ]
        }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            user.refreshToken = refreshToken;
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                enrolledCourses: user.enrolledCourses || [],
                token,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newToken = generateToken(user._id);
        res.json({ token: newToken });
    } catch (error) {
        res.status(403).json({ message: 'Token expired or invalid' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerStudent,
    loginUser,
    refreshToken,
    getMe,
};
