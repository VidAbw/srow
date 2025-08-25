#!/usr/bin/env node

/**
 * Error Troubleshooting Script
 * Helps diagnose and fix Firebase connection and navigation errors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logStep(message) {
  log(`🔧 ${message}`, 'cyan');
}

// Check for specific error patterns
function analyzeErrors() {
  log('\n🔍 Analyzing Error Patterns', 'blue');
  log('============================\n');
  
  const errorPatterns = {
    'ERR_BLOCKED_BY_CLIENT': {
      description: 'Firebase connection blocked by client software',
      severity: 'HIGH',
      solutions: [
        'Disable ad blockers (uBlock Origin, AdBlock Plus)',
        'Add Firebase domains to security software whitelist',
        'Check browser privacy settings',
        'Try incognito/private browsing mode'
      ]
    },
    'Cross-Origin-Opener-Policy': {
      description: 'Browser security policy blocking operations',
      severity: 'MEDIUM',
      solutions: [
        'Check browser security settings',
        'Update Next.js configuration headers',
        'Verify CORS configuration',
        'Check for conflicting browser extensions'
      ]
    },
    'Route Cancelled': {
      description: 'Navigation route cancellation error',
      severity: 'LOW',
      solutions: [
        'Implement navigation guards',
        'Add retry logic for failed navigation',
        'Handle route change events properly',
        'Prevent multiple simultaneous navigations'
      ]
    },
    'net::ERR_BLOCKED_BY_CLIENT': {
      description: 'Network request blocked by client',
      severity: 'HIGH',
      solutions: [
        'Disable security extensions',
        'Whitelist Firebase domains',
        'Check corporate firewall settings',
        'Use VPN or different network'
      ]
    }
  };
  
  log('Common Error Patterns Found:', 'yellow');
  Object.entries(errorPatterns).forEach(([pattern, info]) => {
    log(`\n${pattern}:`, 'magenta');
    log(`  Description: ${info.description}`, 'reset');
    log(`  Severity: ${info.severity}`, info.severity === 'HIGH' ? 'red' : info.severity === 'MEDIUM' ? 'yellow' : 'green');
    log(`  Solutions:`, 'reset');
    info.solutions.forEach(solution => {
      log(`    • ${solution}`, 'reset');
    });
  });
}

// Check project configuration
function checkConfiguration() {
  log('\n🔧 Checking Project Configuration', 'blue');
  log('================================\n');
  
  const configFiles = [
    'next.config.ts',
    'src/lib/firebase.ts',
    'src/lib/firebaseHealth.ts',
    'src/hooks/useNavigationGuard.ts'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logSuccess(`✓ ${file} exists`);
      
      // Check for specific configurations
      const content = fs.readFileSync(file, 'utf8');
      
      if (file === 'next.config.ts') {
        if (content.includes('Cross-Origin-Opener-Policy')) {
          logSuccess('  ✓ COOP headers configured');
        } else {
          logWarning('  ⚠️ COOP headers not found');
        }
        
        if (content.includes('CORS')) {
          logSuccess('  ✓ CORS headers configured');
        } else {
          logWarning('  ⚠️ CORS headers not found');
        }
      }
      
      if (file === 'src/lib/firebaseHealth.ts') {
        if (content.includes('FirebaseHealthChecker')) {
          logSuccess('  ✓ Firebase health checker implemented');
        } else {
          logWarning('  ⚠️ Firebase health checker not found');
        }
      }
      
      if (file === 'src/hooks/useNavigationGuard.ts') {
        if (content.includes('useNavigationGuard')) {
          logSuccess('  ✓ Navigation guard hook implemented');
        } else {
          logWarning('  ⚠️ Navigation guard hook not found');
        }
      }
    } else {
      logError(`✗ ${file} missing`);
    }
  });
}

// Check for browser extension conflicts
function checkBrowserExtensions() {
  log('\n🌐 Browser Extension Conflicts', 'blue');
  log('===============================\n');
  
  const problematicExtensions = [
    'uBlock Origin',
    'AdBlock Plus',
    'Privacy Badger',
    'Ghostery',
    'NoScript',
    'uMatrix'
  ];
  
  log('Problematic Extensions:', 'yellow');
  problematicExtensions.forEach(extension => {
    log(`  • ${extension}`, 'red');
  });
  
  log('\nSolutions:', 'green');
  log('  1. Temporarily disable these extensions');
  log('  2. Add Firebase domains to whitelist');
  log('  3. Use incognito/private browsing mode');
  log('  4. Try different browser');
}

// Check Firebase domain whitelist
function checkFirebaseDomains() {
  log('\n🔥 Firebase Domain Whitelist', 'blue');
  log('============================\n');
  
  const requiredDomains = [
    '*.firebaseapp.com',
    '*.firestore.googleapis.com',
    '*.identitytoolkit.googleapis.com',
    '*.securetoken.googleapis.com',
    '*.storage.googleapis.com',
    '*.cloudfunctions.net'
  ];
  
  log('Required Firebase Domains:', 'yellow');
  requiredDomains.forEach(domain => {
    log(`  • ${domain}`, 'cyan');
  });
  
  log('\nHow to Whitelist in uBlock Origin:', 'green');
  log('  1. Click uBlock Origin icon');
  log('  2. Click "Dashboard" (gear icon)');
  log('  3. Go to "My filters" tab');
  log('  4. Add these lines:');
  log('     ! Firebase domains');
  log('     ||firebaseapp.com');
  log('     ||firestore.googleapis.com');
  log('     ||identitytoolkit.googleapis.com');
  log('     ||securetoken.googleapis.com');
  log('     ||storage.googleapis.com');
  log('     ||cloudfunctions.net');
}

// Generate troubleshooting report
function generateReport() {
  log('\n📋 Troubleshooting Report', 'blue');
  log('==========================\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    errors: [
      'ERR_BLOCKED_BY_CLIENT - Firebase connection blocked',
      'Cross-Origin-Opener-Policy - Browser security policy',
      'Route Cancelled - Navigation errors',
      'net::ERR_BLOCKED_BY_CLIENT - Network blocking'
    ],
    solutions: [
      'Disable ad blockers and security extensions',
      'Whitelist Firebase domains in security software',
      'Check browser privacy and security settings',
      'Use incognito/private browsing mode',
      'Try different browser or device',
      'Check corporate firewall settings'
    ],
    immediateActions: [
      'Disable uBlock Origin temporarily',
      'Add Firebase domains to whitelist',
      'Refresh page and try again',
      'Clear browser cache and cookies'
    ]
  };
  
  log('Immediate Actions Required:', 'red');
  report.immediateActions.forEach(action => {
    log(`  • ${action}`, 'yellow');
  });
  
  log('\nLong-term Solutions:', 'green');
  report.solutions.forEach(solution => {
    log(`  • ${solution}`, 'cyan');
  });
  
  // Save report to file
  const reportPath = 'troubleshooting-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logSuccess(`\n📄 Report saved to: ${reportPath}`);
}

// Main function
function main() {
  log('\n🚀 Firebase Error Troubleshooting Script', 'blue');
  log('==========================================\n');
  
  try {
    analyzeErrors();
    checkConfiguration();
    checkBrowserExtensions();
    checkFirebaseDomains();
    generateReport();
    
    log('\n🎯 Next Steps:', 'green');
    log('1. Follow the immediate actions above');
    log('2. Check the troubleshooting report');
    log('3. Test the application after making changes');
    log('4. Contact support if issues persist');
    
    log('\n✅ Troubleshooting analysis completed!', 'green');
    
  } catch (error) {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { 
  analyzeErrors, 
  checkConfiguration, 
  checkBrowserExtensions, 
  checkFirebaseDomains,
  generateReport 
};
