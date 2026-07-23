require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('../backend/routes/authRoutes');
const courseRoutes = require('../backend/routes/courseRoutes');
const adminRoutes = require('../backend/routes/adminRoutes');
const publicRoutes = require('../backend/routes/publicRoutes');
const studentRoutes = require('../backend/routes/studentRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static uploads if requested via API
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://23it040_db_user:QrbJXgXeItdIJbjE@cluster0.f74agq9.mongodb.net/piyushdhara?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

const connectDb = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return true;
  try {
    await mongoose.connect(mongoUri, { 
        serverSelectionTimeoutMS: 4000, // Fail fast before Vercel 10s timeout
        socketTimeoutMS: 15000,
        bufferCommands: false // Disable buffering so queries fail immediately if not connected
    });
    isConnected = true;
    console.log('Vercel Serverless connected to MongoDB Atlas');
    return true;
  } catch (err) {
    console.error('Vercel Serverless MongoDB connection error:', err.message);
    return false;
  }
};

// Middleware to ensure DB connection per request
app.use(async (req, res, next) => {
  const connected = await connectDb();
  if (!connected) {
      return res.status(500).json({ 
          message: 'Database connection failed. Please ensure MongoDB Atlas IP Whitelist includes 0.0.0.0/0' 
      });
  }
  next();
});

// Support both /api/path and /path routing in Vercel Serverless Function
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/courses', courseRoutes);
app.use('/courses', courseRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/public', publicRoutes);
app.use('/public', publicRoutes);

app.use('/api/student', studentRoutes);
app.use('/student', studentRoutes);

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'PiyushDhara Vercel Serverless API is active',
    database: isConnected ? 'Connected to MongoDB Atlas' : 'Connecting...'
  });
});

// JSON Fallback 404 handler to prevent "Unexpected end of JSON input"
app.use((req, res) => {
  res.status(404).json({ message: `API Route not found: ${req.method} ${req.url}` });
});

// Global JSON Error Handler
app.use((err, req, res, next) => {
  console.error('Serverless Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
