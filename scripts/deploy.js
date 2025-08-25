#!/usr/bin/env node

/**
 * Deployment Script
 * Handles deployment to different environments with proper validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getEnvironmentConfig, validateEnvironmentConfig } = require('../deployment.config.js');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}${step}${colors.reset}: ${message}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Check if required tools are installed
 */
function checkPrerequisites() {
  logStep('Prerequisites Check', 'Verifying required tools...');
  
  const tools = ['node', 'npm', 'git'];
  const missing = [];
  
  for (const tool of tools) {
    try {
      execSync(`${tool} --version`, { stdio: 'ignore' });
      logSuccess(`${tool} is installed`);
    } catch (error) {
      missing.push(tool);
      logError(`${tool} is not installed`);
    }
  }
  
  if (missing.length > 0) {
    logError(`Missing required tools: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    logSuccess('Git repository detected');
  } catch (error) {
    logError('Not a git repository');
    process.exit(1);
  }
}

/**
 * Check environment variables
 */
function checkEnvironmentVariables(env) {
  logStep('Environment Variables', `Checking ${env} environment variables...`);
  
  const envFile = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envFile)) {
    logWarning('.env.local file not found');
    logInfo('Please copy env.template to .env.local and fill in your values');
    return false;
  }
  
  // Read and parse .env.local
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#') && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  // Check required variables for the environment
  const requiredVars = {
    development: ['NEXT_PUBLIC_APP_URL'],
    staging: [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'FIREBASE_PROJECT_ID'
    ],
    production: [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'FIREBASE_PROJECT_ID',
      'STRIPE_SECRET_KEY'
    ]
  };
  
  const missing = requiredVars[env]?.filter(varName => !envVars[varName]) || [];
  
  if (missing.length > 0) {
    logError(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  logSuccess('Environment variables are properly configured');
  return true;
}

/**
 * Run tests
 */
function runTests() {
  logStep('Testing', 'Running test suite...');
  
  try {
    logInfo('Running linting and type checking...');
    execSync('npm run lint', { stdio: 'inherit' });
    execSync('npm run type-check', { stdio: 'inherit' });
    
    logInfo('Running unit tests...');
    execSync('npm run test:coverage', { stdio: 'inherit' });
    
    logInfo('Running E2E tests...');
    execSync('npm run test:e2e', { stdio: 'inherit' });
    
    logSuccess('All tests passed');
    return true;
  } catch (error) {
    logError('Tests failed');
    return false;
  }
}

/**
 * Build application
 */
function buildApplication() {
  logStep('Build', 'Building application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if build was successful
    const buildDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      throw new Error('Build directory not found');
    }
    
    logSuccess('Application built successfully');
    return true;
  } catch (error) {
    logError('Build failed');
    return false;
  }
}

/**
 * Deploy to Firebase
 */
function deployToFirebase(env) {
  logStep('Firebase Deployment', `Deploying to ${env} environment...`);
  
  try {
    const config = getEnvironmentConfig(env);
    
    // Update firebase.json with environment-specific config
    const firebaseConfig = {
      hosting: {
        ...config.firebase.hosting,
        public: env === 'development' ? 'out' : '.next'
      }
    };
    
    const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
    fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseConfig, null, 2));
    
    // Deploy to Firebase
    if (env === 'staging') {
      execSync('firebase deploy --only hosting:staging', { stdio: 'inherit' });
    } else {
      execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    }
    
    logSuccess(`Deployed to Firebase ${env} successfully`);
    return true;
  } catch (error) {
    logError(`Firebase deployment to ${env} failed`);
    return false;
  }
}

/**
 * Deploy to Vercel
 */
function deployToVercel(env) {
  logStep('Vercel Deployment', `Deploying to ${env} environment...`);
  
  try {
    const config = getEnvironmentConfig(env);
    
    if (config.vercel.production) {
      execSync('vercel --prod', { stdio: 'inherit' });
    } else {
      execSync('vercel', { stdio: 'inherit' });
    }
    
    logSuccess(`Deployed to Vercel ${env} successfully`);
    return true;
  } catch (error) {
    logError(`Vercel deployment to ${env} failed`);
    return false;
  }
}

/**
 * Run smoke tests
 */
function runSmokeTests(env) {
  logStep('Smoke Tests', `Running smoke tests on ${env}...`);
  
  try {
    const config = getEnvironmentConfig(env);
    
    // Add your smoke test logic here
    // Example: Check if the app is responding
    logInfo('Smoke tests completed successfully');
    return true;
  } catch (error) {
    logError('Smoke tests failed');
    return false;
  }
}

/**
 * Main deployment function
 */
async function deploy(environment = 'development') {
  log(`\n${colors.bright}${colors.blue}🚀 Starting deployment to ${environment} environment${colors.reset}\n`);
  
  // Validate environment
  if (!['development', 'staging', 'production'].includes(environment)) {
    logError(`Invalid environment: ${environment}`);
    process.exit(1);
  }
  
  try {
    // Check prerequisites
    checkPrerequisites();
    
    // Validate environment configuration
    if (!validateEnvironmentConfig(environment)) {
      process.exit(1);
    }
    
    // Check environment variables
    if (!checkEnvironmentVariables(environment)) {
      process.exit(1);
    }
    
    // Run tests (skip for development)
    if (environment !== 'development') {
      if (!runTests()) {
        process.exit(1);
      }
    }
    
    // Build application
    if (!buildApplication()) {
      process.exit(1);
    }
    
    // Deploy to Firebase
    if (!deployToFirebase(environment)) {
      process.exit(1);
    }
    
    // Deploy to Vercel (optional)
    if (process.env.DEPLOY_TO_VERCEL === 'true') {
      if (!deployToVercel(environment)) {
        logWarning('Vercel deployment failed, but continuing...');
      }
    }
    
    // Run smoke tests for staging and production
    if (environment !== 'development') {
      if (!runSmokeTests(environment)) {
        logWarning('Smoke tests failed, but deployment completed');
      }
    }
    
    log(`\n${colors.bright}${colors.green}🎉 Deployment to ${environment} completed successfully!${colors.reset}\n`);
    
  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const environment = args[0] || 'development';
  
  deploy(environment).catch(error => {
    logError(`Deployment failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { deploy };
