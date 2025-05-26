const express = require('express');
const http = require('http');
const next = require('next');
const path = require('path');
const dotenv = require('dotenv');
const apiRoutes = require('./backend/src/routes/api');

// Load environment variables
dotenv.config();

// Run the build-frontend script to ensure the frontend is built
try {
  require('./build-frontend');
} catch (error) {
  console.warn('Warning: Could not run build-frontend script', error);
}

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Wait for Next.js to be ready
    await nextApp.prepare();

    // Create Express app
    const app = express();
    const server = http.createServer(app);

    // Trust proxy for production
    app.set('trust proxy', 1);

    // API routes
    app.use('/api', apiRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        port: port,
        env: process.env.NODE_ENV || 'development',
      });
    });

    // Serve static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Handle all other routes with Next.js
    app.all('*', (req, res) => {
      return nextHandler(req, res);
    });

    // Start the server
    server.listen(port, '0.0.0.0', () => {
      console.log(`
=================================================
🚀 Unified server running on port ${port}
📱 Next.js frontend: http://localhost:${port}
🔌 API endpoints: http://localhost:${port}/api
=================================================
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer(); 