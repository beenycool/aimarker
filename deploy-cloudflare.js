#!/usr/bin/env node

/**
 * Cloudflare Pages Deployment Helper for Windows
 * 
 * This script uses @cloudflare/next-on-pages to deploy the app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Log with color
const log = {
  info: (msg) => console.log(`${colors.bright}${colors.green}[INFO]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.bright}${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.bright}${colors.red}[ERROR]${colors.reset} ${msg}`)
};

try {
  // Step 1: Build the Next.js app
  log.info('Building Next.js app...');
  execSync('npx next build', { stdio: 'inherit' });
  
  // Step 2: Run @cloudflare/next-on-pages
  log.info('Running @cloudflare/next-on-pages...');
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
  
  // Step 3: Deploy to Cloudflare Pages
  log.info('Deploying to Cloudflare Pages...');
  // The output directory is now .vercel/output/static by default with @cloudflare/next-on-pages
  execSync('npx wrangler pages deploy .vercel/output/static', { stdio: 'inherit' });
  
  log.info('Deployment completed successfully!');
  log.info('Your Next.js app is now live on Cloudflare Pages.');
} catch (error) {
  log.error(`Deployment failed: ${error.message}`);
  log.error(
    'Please ensure you have WSL (Windows Subsystem for Linux) installed and enabled, ' +
    'as @cloudflare/next-on-pages requires it on Windows. Visit https://docs.microsoft.com/en-us/windows/wsl/install for instructions.'
  );
  process.exit(1);
} 