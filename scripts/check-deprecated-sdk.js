#!/usr/bin/env node

/**
 * Script to check for deprecated Farcaster SDK usage
 * This script scans the codebase for any remaining usage of deprecated packages
 */

const fs = require('fs');
const path = require('path');

const deprecatedPackages = [
  '@farcaster/frame-sdk',
  '@farcaster/frame-wagmi-connector',
  '@farcaster/miniapp-sdk',
  '@farcaster/miniapp-wagmi-connector'
];

const scanDirectories = [
  'app',
  'components',
  'lib'
];

const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    deprecatedPackages.forEach(package => {
      if (content.includes(package)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(package)) {
            issues.push({
              package,
              line: index + 1,
              content: line.trim()
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const issues = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .next
        if (item !== 'node_modules' && item !== '.next' && !item.startsWith('.')) {
          issues.push(...scanDirectory(fullPath));
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (fileExtensions.includes(ext)) {
          const fileIssues = scanFile(fullPath);
          if (fileIssues.length > 0) {
            issues.push({
              file: fullPath,
              issues: fileIssues
            });
          }
        }
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return issues;
}

function checkPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const issues = [];
    
    // Check dependencies
    if (packageJson.dependencies) {
      deprecatedPackages.forEach(package => {
        if (packageJson.dependencies[package]) {
          issues.push({
            type: 'dependency',
            package,
            version: packageJson.dependencies[package]
          });
        }
      });
    }
    
    // Check devDependencies
    if (packageJson.devDependencies) {
      deprecatedPackages.forEach(package => {
        if (packageJson.devDependencies[package]) {
          issues.push({
            type: 'devDependency',
            package,
            version: packageJson.devDependencies[package]
          });
        }
      });
    }
    
    return issues;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return [];
  }
}

function runCheck() {
  console.log('🔍 Scanning for deprecated Farcaster SDK usage...\n');
  
  let totalIssues = 0;
  
  // Check package.json
  const packageIssues = checkPackageJson();
  if (packageIssues.length > 0) {
    console.log('📦 Package.json Issues:');
    packageIssues.forEach(issue => {
      console.log(`   ❌ ${issue.package} (${issue.type}): ${issue.version}`);
      totalIssues++;
    });
    console.log('');
  }
  
  // Scan code files
  const codeIssues = [];
  scanDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      codeIssues.push(...scanDirectory(dir));
    }
  });
  
  if (codeIssues.length > 0) {
    console.log('📁 Code Issues:');
    codeIssues.forEach(fileIssue => {
      console.log(`   📄 ${fileIssue.file}:`);
      fileIssue.issues.forEach(issue => {
        console.log(`      ❌ Line ${issue.line}: ${issue.content}`);
        totalIssues++;
      });
    });
    console.log('');
  }
  
  // Summary
  if (totalIssues === 0) {
    console.log('✅ No deprecated SDK usage found!');
    console.log('   Your codebase is clean of deprecated Farcaster packages.');
  } else {
    console.log(`❌ Found ${totalIssues} issues with deprecated SDK usage.`);
    console.log('   Please remove or update these references.');
    process.exit(1);
  }
}

// Run check if this script is executed directly
if (require.main === module) {
  runCheck();
}

module.exports = { runCheck, scanDirectory, checkPackageJson }; 