// Completely manual static build script for Cloudflare Pages
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clean up any existing build directories
function cleanupBuildDirs() {
  console.log('Cleaning up build directories...');
  
  const dirsToClean = [
    '.next',
    '.cloudflare_dist',
    'out'
  ];
  
  dirsToClean.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Removed ${dir} directory`);
    }
  });
}

// Create the output directory structure
function createOutputStructure() {
  console.log('Creating output directory structure...');
  
  const outputDir = path.join(__dirname, 'out');
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Create directories for CSS, JS, images, etc.
  const dirs = [
    'api',
    'api/chess-socket',
    'css',
    'js',
    'images',
    'fonts'
  ];
  
  dirs.forEach(dir => {
    const dirPath = path.join(outputDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Copy all static files from public directory
function copyStaticFiles() {
  console.log('Copying static files...');
  
  const publicDir = path.join(__dirname, 'public');
  const outputDir = path.join(__dirname, 'out');
  
  if (fs.existsSync(publicDir)) {
    copyDirRecursively(publicDir, outputDir);
    console.log('Copied all public files');
  }
}

// Helper function to copy directories recursively
function copyDirRecursively(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Run standard build (not export) to generate JS/CSS
function runStandardBuild() {
  console.log('Running standard Next.js build (not static export)...');
  
  try {
    // Run next build without CF_PAGES to avoid static export
    execSync('next build', { stdio: 'inherit' });
    console.log('Standard build completed');
    
    // Copy built JS/CSS files to output
    console.log('Copying built JS/CSS files...');
    
    // Copy key Next.js build outputs to out directory
    const nextDir = path.join(__dirname, '.next');
    const outputDir = path.join(__dirname, 'out');
    
    // Attempt to copy static directory which contains JS/CSS
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      copyDirRecursively(staticDir, path.join(outputDir, '_next/static'));
      console.log('Copied static assets');
    }
  } catch (error) {
    console.warn('Standard build failed, continuing with manual static build:', error.message);
  }
}

// Create API JSON files
function createApiFiles() {
  console.log('Creating API JSON files...');
  
  const apiDir = path.join(__dirname, 'out/api');
  
  // Create chess-socket.json
  const chessSocketJson = {
    message: "Chess API endpoint",
    status: "static-build",
    docs: "This is a static build of the API. For full functionality use the main application server."
  };
  
  fs.writeFileSync(
    path.join(apiDir, 'chess-socket.json'),
    JSON.stringify(chessSocketJson, null, 2)
  );
  
  // Create chess-socket/index.json
  fs.writeFileSync(
    path.join(apiDir, 'chess-socket/index.json'),
    JSON.stringify(chessSocketJson, null, 2)
  );
  
  console.log('Created API JSON files');
}

// Create HTML pages
function createHtmlPages() {
  console.log('Creating HTML pages...');
  
  const outputDir = path.join(__dirname, 'out');
  
  // Main index.html
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BEEnyCool AI GCSE Marker</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-center">BEEnyCool AI GCSE Marker</h1>
    </header>
    
    <main>
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Welcome to the AI GCSE Marker</h2>
        <p class="mb-4">
          This tool uses AI to help mark GCSE exam questions. Upload your answers and get immediate feedback.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="border p-4 rounded-md">
            <h3 class="text-xl font-medium mb-2">For Students</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>Get immediate feedback on your answers</li>
              <li>See where you can improve</li>
              <li>Practice with real exam questions</li>
            </ul>
          </div>
          
          <div class="border p-4 rounded-md">
            <h3 class="text-xl font-medium mb-2">For Teachers</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>Save time on marking</li>
              <li>Get consistent marking criteria</li>
              <li>Process multiple answers at once</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <a href="https://beenycool-github-io.onrender.com" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition">
          Start Marking Now
        </a>
      </div>
    </main>
    
    <footer class="mt-12 pt-6 border-t text-center text-gray-600">
      <p>&copy; ${new Date().getFullYear()} BEEnyCool AI GCSE Marker</p>
    </footer>
  </div>
  
  <script src="js/main.js"></script>
</body>
</html>
`;
  
  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
  
  // 404.html
  const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found | BEEnyCool AI GCSE Marker</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
  <div class="max-w-md w-full mx-4 bg-white rounded-lg shadow-md p-8 text-center">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <h2 class="text-2xl font-medium text-gray-700 mb-4">Page Not Found</h2>
    <p class="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
      Go Home
    </a>
  </div>
</body>
</html>
`;
  
  fs.writeFileSync(path.join(outputDir, '404.html'), notFoundHtml);
  
  console.log('Created HTML pages');
}

// Create CSS and JS files
function createCssAndJs() {
  console.log('Creating CSS and JS files...');
  
  const outputDir = path.join(__dirname, 'out');
  
  // Create basic CSS
  const cssContent = `
/* Basic styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Additional custom styles */
.container {
  max-width: 1200px;
}
`;
  
  fs.writeFileSync(path.join(outputDir, 'css/style.css'), cssContent);
  
  // Create basic JS
  const jsContent = `
// Basic JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('BEEnyCool AI GCSE Marker - Static Build');
});
`;
  
  fs.writeFileSync(path.join(outputDir, 'js/main.js'), jsContent);
  
  console.log('Created CSS and JS files');
}

// Create Cloudflare Pages configuration
function createCloudflareConfig() {
  console.log('Creating Cloudflare Pages configuration...');
  
  const outputDir = path.join(__dirname, 'out');
  
  // Create _routes.json for Cloudflare Pages
  const routesConfig = {
    "version": 1,
    "include": ["/*"],
    "exclude": ["/_*"],
    "routes": [
      {
        "src": "^/api/chess-socket(?:/.*)?$",
        "dest": "/api/chess-socket.json"
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(outputDir, '_routes.json'),
    JSON.stringify(routesConfig, null, 2)
  );
  
  // Create .nojekyll file
  fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
  
  console.log('Created Cloudflare Pages configuration');
}

// Main function
async function main() {
  try {
    // Step 1: Clean up existing build directories
    cleanupBuildDirs();
    
    // Step 2: Create output directory structure
    createOutputStructure();
    
    // Step 3: Copy all static files from public directory
    copyStaticFiles();
    
    // Step 4: Try to run standard build to get JS/CSS
    runStandardBuild();
    
    // Step 5: Create API JSON files
    createApiFiles();
    
    // Step 6: Create HTML pages
    createHtmlPages();
    
    // Step 7: Create CSS and JS files
    createCssAndJs();
    
    // Step 8: Create Cloudflare Pages configuration
    createCloudflareConfig();
    
    console.log('Manual static build completed successfully');
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

// Run the script
main(); 