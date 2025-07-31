import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';

// Generate a new mnemonic
const mnemonic = generateMnemonic();
const account = mnemonicToAccount(mnemonic);

console.log('🔐 Generated Neynar App Mnemonic:');
console.log('=====================================');
console.log('Mnemonic:', mnemonic);
console.log('Address:', account.address);
console.log('=====================================');
console.log('');
console.log('📝 Instructions:');
console.log('1. Copy the mnemonic above');
console.log('2. Add it to your .env.local file as NEYNAR_APP_MNEMONIC');
console.log('3. Add it to Vercel environment variables');
console.log('4. Use this address as your app signer in Neynar');
console.log('');
console.log('⚠️  IMPORTANT: Keep this mnemonic secure and private!'); 