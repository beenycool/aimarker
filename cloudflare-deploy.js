#!/usr/bin/env node

/**
 * Cloudflare Pages Deployment Helper
 * 
 * This script ensures proper deployment to Cloudflare Pages by:
 * 1. Building the Next.js app in the correct format
 * 2. Generating necessary files for proper routing
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
  // Step 1: Build the Next.js app for Cloudflare
  log.info('Building Next.js app for Cloudflare Pages...');
  execSync('next build', { stdio: 'inherit' });
  
  // Step 2: Generate Cloudflare specific output
  log.info('Generating Cloudflare Pages output with @cloudflare/next-on-pages...');
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
  
  // Step 3: Ensure we have proper _routes.json for SPA behavior
  const routesPath = path.join('.vercel', 'output', 'static', '_routes.json');
  
  if (!fs.existsSync(path.dirname(routesPath))) {
    fs.mkdirSync(path.dirname(routesPath), { recursive: true });
  }
  
  const routesConfig = {
    version: 1,
    include: ['/*'],
    exclude: []
  };
  
  log.info('Creating _routes.json for proper SPA routing...');
  fs.writeFileSync(routesPath, JSON.stringify(routesConfig, null, 2));

  // Step 4: Deploy to Cloudflare Pages
  log.info('Deploying to Cloudflare Pages...');
  execSync('npx wrangler pages deploy .vercel/output/static', { stdio: 'inherit' });
  
  log.info('Deployment completed successfully!');
} catch (error) {
  log.error(`Deployment failed: ${error.message}`);
  process.exit(1);
} 