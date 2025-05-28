#!/usr/bin/env node

/**
 * Cloudflare Pages Deployment Helper for Windows
 * 
 * This script creates a simple static site that redirects to the main app
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
  // Step 1: Setup output directory
  const outputDir = path.join('.vercel', 'output', 'static');
  log.info('Setting up output directory...');
  
  if (fs.existsSync(outputDir)) {
    log.info('Cleaning up output directory...');
    execSync(`rmdir /s /q "${outputDir}"`, { stdio: 'inherit' });
  }
  
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Step 2: Copy public directory
  if (fs.existsSync('public')) {
    log.info('Copying public files...');
    execSync(`xcopy /E /I /Y public "${outputDir}"`, { stdio: 'inherit' });
  }
  
  // Step 3: Create a redirect HTML file
  log.info('Creating redirect HTML files...');
  
  const mainAppUrl = 'https://beenycool-github-io.onrender.com';
  
  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GCSE AI Marker</title>
  <link rel="icon" href="/favicon.ico" />
  <meta http-equiv="refresh" content="0;url=${mainAppUrl}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      color: #333;
    }
    
    .message {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
      max-width: 500px;
      width: 100%;
    }
    
    h1 {
      margin-top: 0;
      color: #0070f3;
    }
    
    p {
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .link {
      display: inline-block;
      padding: 10px 20px;
      background-color: #0070f3;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .link:hover {
      background-color: #0051a2;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
        color: #f5f5f5;
      }
      
      .message {
        background-color: #2a2a2a;
      }
      
      h1 {
        color: #3498db;
      }
      
      .link {
        background-color: #3498db;
      }
      
      .link:hover {
        background-color: #2980b9;
      }
    }
  </style>
</head>
<body>
  <div class="message">
    <h1>GCSE AI Marker</h1>
    <p>Redirecting you to the main application...</p>
    <p>If you are not redirected automatically, please click the link below:</p>
    <a class="link" href="${mainAppUrl}">Go to Application</a>
  </div>
  
  <script>
    // Redirect immediately
    window.location.href = "${mainAppUrl}";
  </script>
</body>
</html>`;

  // Write the main index.html
  fs.writeFileSync(path.join(outputDir, 'index.html'), redirectHtml);
  
  // Create directories for common routes
  const routes = ['todo', 'debug'];
  routes.forEach(route => {
    const routeDir = path.join(outputDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), redirectHtml);
  });
  
  // Step 4: Create a 404 page
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - GCSE AI Marker</title>
  <link rel="icon" href="/favicon.ico" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      color: #333;
    }
    
    .message {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
      max-width: 500px;
      width: 100%;
    }
    
    h1 {
      margin-top: 0;
      color: #e74c3c;
    }
    
    p {
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .link {
      display: inline-block;
      padding: 10px 20px;
      background-color: #0070f3;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .link:hover {
      background-color: #0051a2;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
        color: #f5f5f5;
      }
      
      .message {
        background-color: #2a2a2a;
      }
      
      h1 {
        color: #e74c3c;
      }
      
      .link {
        background-color: #3498db;
      }
      
      .link:hover {
        background-color: #2980b9;
      }
    }
  </style>
</head>
<body>
  <div class="message">
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <p>Please visit our main application:</p>
    <a class="link" href="${mainAppUrl}">Go to Main Application</a>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, '404.html'), notFoundHtml);
  
  // Step 5: Create _worker.js for API proxying
  log.info('Creating worker script for API proxying...');
  const workerJs = `
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API requests are proxied to the backend
    if (url.pathname.startsWith('/api/')) {
      const backendUrl = "https://beenycool-github-io.onrender.com";
      const apiUrl = new URL(url.pathname + url.search, backendUrl);
      
      // Forward the request to the backend
      return fetch(apiUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
      });
    }
    
    // Check if this is a request for a static asset
    if (url.pathname.includes('.') && 
        !url.pathname.endsWith('.html') && 
        !url.pathname.endsWith('/')) {
      try {
        // Try to serve the static asset from the assets store
        return await env.ASSETS.fetch(request);
      } catch (error) {
        // If we can't find the asset, forward to the main app
        return Response.redirect("https://beenycool-github-io.onrender.com" + url.pathname, 302);
      }
    }
    
    // For all other requests
    try {
      // Try to serve the HTML file
      let pathToTry = url.pathname;
      
      if (pathToTry === '/') {
        pathToTry = '/index.html';
      } else if (pathToTry.endsWith('/')) {
        pathToTry = pathToTry + 'index.html';
      } else if (!pathToTry.includes('.')) {
        pathToTry = pathToTry + '/index.html';
      }
      
      return await env.ASSETS.fetch(new Request(new URL(pathToTry, url.origin)));
    } catch (error) {
      // If we can't find the file, redirect to the main app
      return Response.redirect("https://beenycool-github-io.onrender.com" + url.pathname, 302);
    }
  }
};`;

  fs.writeFileSync(path.join(outputDir, '_worker.js'), workerJs);
  
  // Step 6: Create _routes.json for routing configuration
  log.info('Creating routes configuration...');
  const routesConfig = {
    version: 1,
    include: ['/*'],
    exclude: []
  };
  
  fs.writeFileSync(path.join(outputDir, '_routes.json'), JSON.stringify(routesConfig, null, 2));
  
  // Step 7: Deploy to Cloudflare Pages
  log.info('Deploying to Cloudflare Pages...');
  execSync('npx wrangler pages deploy .vercel/output/static', { stdio: 'inherit' });
  
  log.info('Deployment completed successfully!');
  log.info('Your site is now live on Cloudflare Pages with redirection to your main app.');
} catch (error) {
  log.error(`Deployment failed: ${error.message}`);
  process.exit(1);
} 