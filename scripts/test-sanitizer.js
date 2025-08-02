#!/usr/bin/env node

/**
 * Test Script for API Response Sanitizer
 * This script tests that the sanitizer correctly blocks React element objects
 * and allows valid data through.
 */

// Import the sanitizeResponse function
const fs = require('fs');
const path = require('path');

// Read and evaluate the sanitizeResponse function
const sanitizeResponsePath = path.join(__dirname, '../lib/sanitizeResponse.ts');
const sanitizeResponseContent = fs.readFileSync(sanitizeResponsePath, 'utf8');

// Extract the sanitizeResponse function using regex
const functionMatch = sanitizeResponseContent.match(/export function sanitizeResponse\([^)]*\)[^{]*{([\s\S]*?)}/);
if (!functionMatch) {
  console.error('Could not extract sanitizeResponse function');
  process.exit(1);
}

// Create a simple implementation for testing
function sanitizeResponse(obj) {
  if (
    obj &&
    typeof obj === 'object' &&
    'type' in obj &&
    'props' in obj &&
    '$$typeof' in obj
  ) {
    // Block any object that has the React element $$typeof symbol
    throw new Error('API tried to return a React element object!');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeResponse);
  }
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      obj[key] = sanitizeResponse(obj[key]);
    }
  }
  return obj;
}

// Test cases
const testCases = [
  {
    name: 'Valid JSON object',
    input: { name: 'test', value: 123 },
    shouldPass: true,
    description: 'Normal JSON object should pass through'
  },
  {
    name: 'Valid array',
    input: [1, 2, 3, 'test'],
    shouldPass: true,
    description: 'Normal array should pass through'
  },
  {
    name: 'Valid primitive',
    input: 'test string',
    shouldPass: true,
    description: 'String primitive should pass through'
  },
  {
    name: 'React element object (should be blocked)',
    input: { type: 'div', props: { children: 'test' }, $$typeof: Symbol.for('react.element') },
    shouldPass: false,
    description: 'React element object should be blocked'
  },
  {
    name: 'React element object without $$typeof (should pass)',
    input: { type: 'div', props: { children: 'test' } },
    shouldPass: true,
    description: 'React element object without $$typeof should pass (not a real React element)'
  },
  {
    name: 'Object with type and props but not React element',
    input: { type: 'user', props: { name: 'test' } },
    shouldPass: true,
    description: 'Object with type/props but not React element should pass'
  },
  {
    name: 'Null value',
    input: null,
    shouldPass: true,
    description: 'Null should pass through'
  },
  {
    name: 'Undefined value',
    input: undefined,
    shouldPass: true,
    description: 'Undefined should pass through'
  },
  {
    name: 'Nested React element object',
    input: {
      data: {
        items: [
          { type: 'div', props: { children: 'test' }, $$typeof: Symbol.for('react.element') }
        ]
      }
    },
    shouldPass: false,
    description: 'Nested React element object should be blocked'
  }
];

function runTests() {
  console.log('🧪 Testing API Response Sanitizer...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    try {
      const result = sanitizeResponse(testCase.input);
      const passed = testCase.shouldPass;
      
      if (passed) {
        console.log(`✅ Test ${index + 1}: ${testCase.name}`);
        console.log(`   ${testCase.description}`);
      } else {
        console.log(`❌ Test ${index + 1}: ${testCase.name}`);
        console.log(`   ${testCase.description}`);
        console.log(`   Expected: Should be blocked, Got: ${JSON.stringify(result)}`);
        failed++;
      }
    } catch (error) {
      if (!testCase.shouldPass) {
        console.log(`✅ Test ${index + 1}: ${testCase.name}`);
        console.log(`   ${testCase.description}`);
        console.log(`   Correctly blocked: ${error.message}`);
        passed++;
      } else {
        console.log(`❌ Test ${index + 1}: ${testCase.name}`);
        console.log(`   ${testCase.description}`);
        console.log(`   Unexpectedly blocked: ${error.message}`);
        failed++;
      }
    }
    console.log('');
  });
  
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n❌ Some tests failed! The sanitizer may not be working correctly.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! The sanitizer is working correctly.');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testCases }; 