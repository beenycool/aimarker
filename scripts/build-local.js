#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting local build process...\n');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('.next')) {
    execSync('npx rimraf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('npx rimraf out', { stdio: 'inherit' });
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the application (static export handled by next.config.js)
  console.log('\n🏗️  Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Static files are in the "out" directory');
  console.log('🌐 You can serve them locally with: npx serve out');

} catch (error) {
  console.error('\n❌ Build failed:');
  console.error(error.message);
  process.exit(1);
}