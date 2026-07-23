require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static uploads if requested via API
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://23it040_db_user:QrbJXgXeItdIJbjE@cluster0.f74agq9.mongodb.net/piyushdhara?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

const connectDb = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('Vercel Serverless connected to MongoDB Atlas');
  } catch (err) {
    console.error('Vercel Serverless MongoDB connection error:', err.message);
  }
};

// Middleware to ensure DB connection per request
app.use(async (req, res, next) => {
  await connectDb();
  next();
});

// Import backend routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/courses', require('../backend/routes/courseRoutes'));
app.use('/api/admin', require('../backend/routes/adminRoutes'));
app.use('/api/public', require('../backend/routes/publicRoutes'));
app.use('/api/student', require('../backend/routes/studentRoutes'));

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'PiyushDhara Vercel Serverless API is active',
    database: isConnected ? 'Connected to MongoDB Atlas' : 'Connecting...'
  });
});

module.exports = app;
