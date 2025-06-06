const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes and middleware
const apiRoutes = require('./routes/api');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beenycool';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Trust proxy for Render deployment (important for rate limiting)
app.set('trust proxy', 1);

// Apply middleware - Secure CORS to only allow frontend domain
app.use(cors({
  origin: [
    'https://aimarker.tech',
    'https://www.aimarker.tech',
    'http://localhost:3001', // for development
    'http://localhost:3000'  // for development
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '5mb' })); // Increased limit for screen captures
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log HTTP requests
app.use(helmet());

// Rate limiting - More restrictive limits
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per 15 minutes (more restrictive)
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// Use API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;

console.log(`Starting API server on port ${PORT}`);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`API endpoints accessible at http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
  } else {
    console.error(`Server error: ${error.message}`);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down API server...');
  server.close(() => {
    console.log('API server closed');
    process.exit(0);
  });
});

module.exports = server;