#!/usr/bin/env node

/**
 * Azure App Service startup script
 * This script ensures proper startup on Azure with correct environment handling
 */

const path = require('path');
const { spawn } = require('child_process');

// Set Azure-specific environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || process.env.WEBSITES_PORT || 8080;

// Azure App Service specific settings
if (process.env.WEBSITE_SITE_NAME) {
  console.log(`Starting on Azure App Service: ${process.env.WEBSITE_SITE_NAME}`);
  console.log(`Port: ${process.env.PORT}`);
  
  // Set Azure-specific flags
  process.env.AZURE = 'true';
  process.env.DISABLE_CHESS_SERVER = 'true'; // Disable separate chess server on Azure
}

// Start the server using the existing server-start.js
console.log('Starting Beenycool Backend Server...');
console.log(`Node.js Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT}`);

const server = spawn('node', ['server-start.js'], {
  cwd: __dirname,
  env: process.env,
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Handle shutdown signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});