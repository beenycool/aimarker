#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

/**
 * Test runner for Games Page comprehensive test suite
 * Executes performance, data fetch, caching, and regression tests
 */

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
};

const testSuites = [
  {
    name: 'Performance Tests',
    description: 'React Profiler and render time measurement tests',
    pattern: 'app/games/page.performance.test.tsx',
    thresholds: {
      coverage: 80,
      maxRenderTime: 200,
      maxTabSwitchTime: 50
    }
  },
  {
    name: 'Data Fetch Tests',
    description: 'API latency and optimization tests',
    pattern: 'app/games/page.datafetch.test.tsx',
    thresholds: {
      coverage: 85,
      maxLoadTime: 300,
      maxApiLatency: 400
    }
  },
  {
    name: 'Caching Tests',
    description: 'LocalStorage and cache behavior validation',
    pattern: 'app/games/page.caching.test.tsx',
    thresholds: {
      coverage: 90,
      maxCacheWriteTime: 100,
      maxCacheReadTime: 50
    }
  },
  {
    name: 'Regression Tests',
    description: 'Existing functionality preservation tests',
    pattern: 'app/games/page.regression.test.tsx',
    thresholds: {
      coverage: 95,
      passingRate: 100
    }
  }
];

const main = async () => {
  log('\n🧪 Games Page Comprehensive Test Suite', 'bold');
  log('=====================================', 'blue');
  
  const startTime = Date.now();
  let passedSuites = 0;
  let totalTests = 0;
  
  for (const suite of testSuites) {
    log(`\n📋 Running ${suite.name}...`, 'yellow');
    log(`   ${suite.description}`, 'blue');
    
    try {
      const suiteStartTime = Date.now();
      
      // Run the specific test suite
      await runCommand('npx', [
        'jest',
        '--config=jest.games.config.js',
        '--testPathPattern=' + suite.pattern,
        '--coverage',
        '--coverageReporters=text-summary',
        '--verbose'
      ]);
      
      const suiteEndTime = Date.now();
      const suiteDuration = suiteEndTime - suiteStartTime;
      
      log(`   ✅ ${suite.name} passed in ${suiteDuration}ms`, 'green');
      passedSuites++;
      
      // Performance thresholds check
      if (suite.thresholds.maxRenderTime && suiteDuration > suite.thresholds.maxRenderTime * 10) {
        log(`   ⚠️  Test suite took longer than expected (${suiteDuration}ms)`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ ${suite.name} failed`, 'red');
      log(`   Error: ${error.message}`, 'red');
    }
  }
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  log('\n📊 Test Results Summary', 'bold');
  log('=======================', 'blue');
  log(`Total Suites: ${testSuites.length}`, 'blue');
  log(`Passed: ${passedSuites}`, passedSuites === testSuites.length ? 'green' : 'yellow');
  log(`Failed: ${testSuites.length - passedSuites}`, passedSuites === testSuites.length ? 'green' : 'red');
  log(`Total Duration: ${totalDuration}ms`, 'blue');
  
  if (passedSuites === testSuites.length) {
    log('\n🎉 All test suites passed successfully!', 'green');
    
    // Run additional performance benchmarks
    log('\n🚀 Running Performance Benchmarks...', 'yellow');
    
    try {
      await runCommand('npx', [
        'jest',
        '--config=jest.games.config.js',
        '--testPathPattern=app/games/page.*test.tsx',
        '--silent',
        '--runInBand' // Run tests serially for accurate performance measurement
      ]);
      
      log('   ✅ Performance benchmarks completed', 'green');
    } catch (error) {
      log('   ⚠️  Performance benchmarks had issues', 'yellow');
    }
    
    process.exit(0);
  } else {
    log('\n❌ Some test suites failed. Please check the output above.', 'red');
    process.exit(1);
  }
};

// Additional utility functions for CI/CD integration
const generateReport = async () => {
  log('\n📈 Generating detailed test report...', 'yellow');
  
  try {
    await runCommand('npx', [
      'jest',
      '--config=jest.games.config.js',
      '--testPathPattern=app/games/page.*test.tsx',
      '--coverage',
      '--coverageReporters=html,lcov,json-summary',
      '--outputFile=test-results/games-page-results.json',
      '--json'
    ]);
    
    log('   ✅ Test report generated in test-results/', 'green');
  } catch (error) {
    log('   ⚠️  Report generation had issues', 'yellow');
  }
};

const runContinuousIntegration = async () => {
  log('\n🔄 Running in CI mode...', 'yellow');
  
  // Set stricter thresholds for CI
  process.env.CI = 'true';
  process.env.NODE_ENV = 'test';
  
  try {
    await main();
    await generateReport();
    
    log('\n✅ CI run completed successfully', 'green');
  } catch (error) {
    log('\n❌ CI run failed', 'red');
    process.exit(1);
  }
};

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes('--ci')) {
  runContinuousIntegration();
} else if (args.includes('--report')) {
  generateReport();
} else if (args.includes('--help')) {
  log('\nGames Page Test Runner', 'bold');
  log('Usage: node scripts/run-games-tests.js [options]', 'blue');
  log('\nOptions:', 'blue');
  log('  --ci       Run in continuous integration mode', 'blue');
  log('  --report   Generate detailed test report only', 'blue');
  log('  --help     Show this help message', 'blue');
  log('\nTest Categories:', 'blue');
  testSuites.forEach(suite => {
    log(`  📋 ${suite.name}: ${suite.description}`, 'blue');
  });
} else {
  main();
}