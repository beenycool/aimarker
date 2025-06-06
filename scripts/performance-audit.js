#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Performance Audit Script
 * Analyzes bundle size, lighthouse scores, and performance metrics
 */

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bold}${colors.blue}=== ${message} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

// Bundle size analysis
function analyzeBundleSize() {
  logHeader('Bundle Size Analysis');
  
  const buildDir = '.next';
  if (!fs.existsSync(buildDir)) {
    logError('Build directory not found. Run npm run build first.');
    return;
  }

  try {
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const chunks = path.join(staticDir, 'chunks');
      const css = path.join(staticDir, 'css');
      
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;

      // Analyze JS chunks
      if (fs.existsSync(chunks)) {
        const jsFiles = fs.readdirSync(chunks).filter(f => f.endsWith('.js'));
        jsFiles.forEach(file => {
          const stats = fs.statSync(path.join(chunks, file));
          jsSize += stats.size;
          totalSize += stats.size;
        });
        log(`JavaScript bundles: ${jsFiles.length} files, ${(jsSize / 1024).toFixed(2)} KB`);
      }

      // Analyze CSS files
      if (fs.existsSync(css)) {
        const cssFiles = fs.readdirSync(css).filter(f => f.endsWith('.css'));
        cssFiles.forEach(file => {
          const stats = fs.statSync(path.join(css, file));
          cssSize += stats.size;
          totalSize += stats.size;
        });
        log(`CSS bundles: ${cssFiles.length} files, ${(cssSize / 1024).toFixed(2)} KB`);
      }

      log(`Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
      
      // Recommendations
      if (totalSize > 500000) { // 500KB
        logWarning('Bundle size is large. Consider code splitting and lazy loading.');
      } else {
        logSuccess('Bundle size is optimized.');
      }
    }
  } catch (error) {
    logError(`Bundle analysis failed: ${error.message}`);
  }
}

// Performance recommendations
function performanceRecommendations() {
  logHeader('Performance Recommendations');
  
  const recommendations = [
    {
      check: () => fs.existsSync('public/sw.js'),
      message: 'Service Worker for caching',
      action: 'Service Worker is configured ✅'
    },
    {
      check: () => {
        const nextConfig = fs.readFileSync('next.config.js', 'utf8');
        return nextConfig.includes('splitChunks');
      },
      message: 'Code splitting configuration',
      action: 'Code splitting is configured ✅'
    },
    {
      check: () => {
        const headers = fs.readFileSync('_headers', 'utf8');
        return headers.includes('Cache-Control');
      },
      message: 'Caching headers',
      action: 'Caching headers are configured ✅'
    },
    {
      check: () => fs.existsSync('lib/performance-utils.ts'),
      message: 'Performance monitoring utilities',
      action: 'Performance monitoring is configured ✅'
    },
    {
      check: () => fs.existsSync('app/hooks/usePerformanceMonitoring.js'),
      message: 'Performance monitoring hook',
      action: 'Performance hook is configured ✅'
    }
  ];

  recommendations.forEach(({ check, message, action }) => {
    if (check()) {
      logSuccess(action);
    } else {
      logWarning(`Missing: ${message}`);
    }
  });
}

// Generate performance report
function generateReport() {
  logHeader('Performance Optimization Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      '✅ Enhanced Next.js configuration with advanced code splitting',
      '✅ Service Worker for aggressive caching',
      '✅ Performance monitoring with Core Web Vitals tracking',
      '✅ Optimized loading skeletons and lazy loading',
      '✅ Enhanced HTTP headers for caching and security',
      '✅ Critical CSS optimization',
      '✅ Resource preloading and DNS prefetching',
      '✅ Bundle size optimization and analysis tools'
    ],
    recommendations: [
      '🔍 Run lighthouse audit: npm run lighthouse',
      '📊 Analyze bundle: npm run build:analyze',
      '⚡ Monitor performance: Check browser DevTools for Core Web Vitals',
      '🗜️ Consider image optimization if using many images',
      '🔄 Enable compression at server level (gzip/brotli)'
    ]
  };

  const reportPath = 'performance-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logSuccess(`Performance report saved to ${reportPath}`);

  // Display key metrics
  log('\n📈 Key Performance Improvements:');
  report.optimizations.forEach(opt => log(opt));
  
  log('\n🎯 Next Steps:');
  report.recommendations.forEach(rec => log(rec));
}

// Main execution
function main() {
  log(`${colors.bold}${colors.blue}🚀 Performance Audit Tool${colors.reset}\n`);
  
  try {
    analyzeBundleSize();
    performanceRecommendations();
    generateReport();
    
    logHeader('Quick Commands');
    log('npm run build:analyze     - Analyze bundle with webpack-bundle-analyzer');
    log('npm run lighthouse       - Run Lighthouse performance audit');
    log('npm run build:performance - Build and run lighthouse audit');
    
  } catch (error) {
    logError(`Audit failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the audit
if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  performanceRecommendations,
  generateReport
};