#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 API Key Setup Tool');
console.log('=====================\n');

const envPath = path.join(__dirname, '.env.local');

// Function to read current .env.local
function readEnvFile() {
  try {
    return fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ .env.local file not found');
    process.exit(1);
  }
}

// Function to update environment variable
function updateEnvVar(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  } else {
    return content + `\n${key}=${value}`;
  }
}

// Function to prompt for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  let envContent = readEnvFile();
  
  console.log('Please enter your API keys:\n');
  
  // OpenAI API Key
  const openaiKey = await askQuestion('🔹 Enter your OpenAI API Key (starts with sk-): ');
  if (openaiKey && openaiKey.startsWith('sk-')) {
    envContent = updateEnvVar(envContent, 'OPENAI_API_KEY', openaiKey);
    envContent = updateEnvVar(envContent, 'NEXT_PUBLIC_OPENAI_API_KEY', openaiKey);
    console.log('✅ OpenAI API Key updated');
  } else if (openaiKey) {
    console.log('⚠️  OpenAI key format seems incorrect (should start with sk-)');
  }
  
  console.log('');
  
  // Farcaster API Key
  const farcasterKey = await askQuestion('🔹 Enter your Farcaster API Key (starts with fc_): ');
  if (farcasterKey && farcasterKey.startsWith('fc_')) {
    envContent = updateEnvVar(envContent, 'FARCASTER_API_KEY', farcasterKey);
    console.log('✅ Farcaster API Key updated');
  } else if (farcasterKey) {
    console.log('⚠️  Farcaster key format seems incorrect (should start with fc_)');
  }
  
  console.log('');
  
  // Write updated content
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file updated successfully!');
    console.log('\n🔄 Please restart your development server:');
    console.log('   npm run dev');
    console.log('\n🎯 Then test your app at: http://localhost:3000');
  } catch (error) {
    console.log('❌ Error updating .env.local file:', error.message);
  }
  
  rl.close();
}

main().catch(console.error); 