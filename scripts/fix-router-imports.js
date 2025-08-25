#!/usr/bin/env node

/**
 * Script to fix all router imports across the project
 * Replaces next/navigation with next/router to prevent "Cancel rendering route" errors
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
  blue: '\x1b[34m'
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

// Find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Fix router imports in a file
function fixRouterImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Check if file contains next/navigation
    if (content.includes('next/navigation')) {
      logInfo(`Fixing router imports in: ${filePath}`);
      
      // Replace next/navigation with next/router
      content = content.replace(
        /from\s+['"]next\/navigation['"]/g,
        "from 'next/router'"
      );
      
      // Replace useRouter usage patterns
      content = content.replace(
        /useRouter\s*\(\s*\)/g,
        'useRouter()'
      );
      
      // Update any navigation-specific imports
      content = content.replace(
        /import\s*{\s*useRouter\s*}\s*from\s*['"]next\/navigation['"]/g,
        "import { useRouter } from 'next/router'"
      );
      
      hasChanges = true;
    }
    
    // Check for other potential router conflicts
    if (content.includes('useRouter') && !content.includes('next/router')) {
      logWarning(`Potential router import issue in: ${filePath}`);
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      logSuccess(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    logError(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  log('\n🚀 Router Import Fix Script', 'blue');
  log('========================\n');
  
  const projectRoot = process.cwd();
  logInfo(`Project root: ${projectRoot}`);
  
  // Find all relevant files
  logInfo('Scanning for files to fix...');
  const files = findFiles(projectRoot);
  logInfo(`Found ${files.length} files to check`);
  
  let fixedCount = 0;
  let totalFiles = 0;
  
  // Process each file
  for (const file of files) {
    totalFiles++;
    if (fixRouterImports(file)) {
      fixedCount++;
    }
  }
  
  // Summary
  log('\n📊 Fix Summary', 'blue');
  log('==============');
  logSuccess(`Files processed: ${totalFiles}`);
  logSuccess(`Files fixed: ${fixedCount}`);
  
  if (fixedCount > 0) {
    log('\n🎯 Next Steps:', 'green');
    log('1. Restart your development server');
    log('2. Test the login functionality');
    log('3. Check for "Cancel rendering route" errors');
    log('4. Verify all navigation works correctly');
    
    log('\n🔄 Restarting development server...', 'yellow');
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      logInfo('Development server restart command completed');
    }
  } else {
    log('\n✨ No router import issues found!', 'green');
  }
  
  log('\n✅ Router import fix completed!', 'green');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { fixRouterImports, findFiles };
