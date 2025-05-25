// Script to handle Cloudflare builds with API route exclusion
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cleanup function to remove any leftover build directories
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

// Main function to handle build
async function main() {
  try {
    // Clean up first
    cleanupBuildDirs();
    
    // Run Next.js build for Cloudflare with static export
    // This will exclude API routes due to our next.config.js settings
    console.log('Running Next.js build for Cloudflare...');
    execSync('cross-env CF_PAGES=1 next build', { stdio: 'inherit' });
    
    console.log('Build completed successfully');
    
    // Optional: You can add post-build steps here, like copying specific files
    // For example, adding a _redirects file for Cloudflare Pages
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the script
main(); 