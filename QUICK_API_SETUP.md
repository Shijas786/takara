# Quick API Setup Guide

## Current Issue
Your app is failing because you have placeholder API keys in your `.env.local` file. You need to replace them with real API keys.

## Required API Keys

### 1. OpenAI API Key (Required for Content Generation)
**Error**: `Incorrect API key provided: your_ope************here`

**How to get it**:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/login and go to "API Keys"
3. Create a new secret key
4. Copy the key (starts with `sk-`)

**Update your `.env.local`**:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-openai-key-here
```

### 2. Farcaster API Key (Required for QR Code)
**Error**: QR code not showing

**How to get it**:
1. Go to [Farcaster Developer Portal](https://developer.farcaster.xyz/)
2. Sign in with your Farcaster account
3. Create a new application
4. Copy your API key (starts with `fc_`)

**Update your `.env.local`**:
```env
FARCASTER_API_KEY=fc-your-actual-farcaster-key-here
```

## Quick Fix Steps

### Step 1: Get OpenAI API Key
1. Visit: https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy the key

### Step 2: Get Farcaster API Key
1. Visit: https://developer.farcaster.xyz/
2. Create a new application
3. Copy the API key

### Step 3: Update Environment File
Edit your `.env.local` file and replace these lines:

```env
# Replace this:
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
FARCASTER_API_KEY=your_farcaster_api_key_here

# With your actual keys:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FARCASTER_API_KEY=fc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Restart Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test
1. Go to http://localhost:3000
2. Try generating content (should work with OpenAI key)
3. Try "Connect & Post" (should show QR code with Farcaster key)

## Optional API Keys
The other API keys (Coinbase, Supabase, etc.) are optional and won't prevent the app from working. You can leave them as placeholders for now.

## Troubleshooting

### If you still get errors:
1. **Check the key format**:
   - OpenAI: starts with `sk-`
   - Farcaster: starts with `fc_`

2. **Verify the keys work**:
   - Test OpenAI: Try generating content
   - Test Farcaster: Try the QR code

3. **Check server logs** for specific error messages

### Common Issues:
- **"Invalid API key"**: Check the key format and make sure you copied it correctly
- **"Rate limit exceeded"**: Wait a few minutes and try again
- **"Authentication failed"**: Verify your API key is active

## Need Help?
- OpenAI: https://platform.openai.com/docs
- Farcaster: https://developer.farcaster.xyz/
- Check the server console for detailed error messages 