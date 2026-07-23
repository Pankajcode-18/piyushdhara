require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// Serve Static Frontend Assets (if built for production)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const fs = require('fs');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('/*path', (req, res) => {
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
