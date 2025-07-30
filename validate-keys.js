#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 API Key Validation Tool');
console.log('==========================\n');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ .env.local file not found');
  console.log('Please run the setup script first: ./setup-env.sh');
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

console.log('📋 Current API Key Status:\n');

// Check OpenAI API Key
const openaiKey = envVars.OPENAI_API_KEY;
if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
  if (openaiKey.startsWith('sk-')) {
    console.log('✅ OpenAI API Key: Valid format');
  } else {
    console.log('⚠️  OpenAI API Key: Invalid format (should start with sk-)');
  }
} else {
  console.log('❌ OpenAI API Key: Not configured');
}

// Check Farcaster API Key
const farcasterKey = envVars.FARCASTER_API_KEY;
if (farcasterKey && farcasterKey !== 'your_farcaster_api_key_here') {
  if (farcasterKey.startsWith('fc_')) {
    console.log('✅ Farcaster API Key: Valid format');
  } else {
    console.log('⚠️  Farcaster API Key: Invalid format (should start with fc_)');
  }
} else {
  console.log('❌ Farcaster API Key: Not configured');
}

// Check other keys
const otherKeys = [
  'COINBASE_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_ONCHAINKIT_API_KEY'
];

console.log('\n📋 Optional API Keys:');
otherKeys.forEach(key => {
  const value = envVars[key];
  if (value && !value.includes('your_') && !value.includes('placeholder')) {
    console.log(`✅ ${key}: Configured`);
  } else {
    console.log(`⏭️  ${key}: Not configured (optional)`);
  }
});

console.log('\n🎯 Next Steps:');
console.log('1. Get your API keys from the respective platforms');
console.log('2. Update your .env.local file with real keys');
console.log('3. Restart your development server');
console.log('4. Test the functionality');

console.log('\n📚 Resources:');
console.log('- OpenAI: https://platform.openai.com/api-keys');
console.log('- Farcaster: https://developer.farcaster.xyz/');
console.log('- Setup Guide: QUICK_API_SETUP.md'); 