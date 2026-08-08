require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const path = require('path');

const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';
const fallbackUri = 'mongodb://127.0.0.1:27017/piyushdhara';

mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected successfully to Cloud Atlas cluster'))
  .catch((err) => {
    console.warn('MongoDB Atlas Cloud connection warning:', err.message);
    console.warn('Note: Ensure 0.0.0.0/0 (Allow Access from Anywhere) is whitelisted in MongoDB Atlas Network Access.');
    if (primaryUri !== fallbackUri) {
      console.log('Falling back to local MongoDB instance...');
      mongoose.connect(fallbackUri)
        .then(() => console.log('Connected to local MongoDB instance successfully'))
        .catch(localErr => console.error('Local MongoDB connection error:', localErr.message));
    }
  });

// API Routes
app.use('/api/auth/student', require('./routes/studentAuthRoutes'));
app.use('/auth/student', require('./routes/studentAuthRoutes'));
app.use('/api/auth/teacher', require('./routes/teacherRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
const http = require('http');
const server = http.createServer(app);
let io = null;

try {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('join_community', () => {
      socket.join('community_room');
    });
    socket.on('join_post', (postId) => {
      socket.join(`post_${postId}`);
    });
  });
} catch (e) {
  console.warn('Socket.IO optional module warning:', e.message);
}

// Middleware to pass io socket instance to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api', require('./routes/commentRoutes'));
app.use('/api', require('./routes/feedbackRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Serve Static Frontend Assets (if built for production)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const fs = require('fs');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: `API route not found: ${req.method} ${req.path}` });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Basic Health Check Route for API-only deployments
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'PiyushDhara Educational Platform API is running',
      version: '1.0.0'
    });
  });
}

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with Socket.IO enabled`);
  });
}

module.exports = app;
