# Quick Setup Guide - Fix 500 Error

## The Problem
You're getting a 500 Internal Server Error when calling `/api/openai/generate` because the OpenAI API key is not configured.

## The Solution
You need to set up your environment variables. Here's how:

### 1. Create Environment File
Create a `.env.local` file in your project root:

```bash
touch .env.local
```

### 2. Add Required Environment Variables
Add the following to your `.env.local` file:

```env
# OpenAI Configuration (REQUIRED - This is what's causing the 500 error)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Other optional configurations
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
FARCASTER_API_KEY=your_farcaster_api_key_here
NEYNAR_API_KEY=your_neynar_api_key_here
COINBASE_API_KEY=your_coinbase_api_key_here
COINBASE_API_SECRET=your_coinbase_api_secret_here
COINBASE_PASSPHRASE=your_coinbase_passphrase_here
```

### 3. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Copy the generated key
6. Replace `sk-your-openai-api-key-here` in your `.env.local` file

### 4. Restart Your Development Server
```bash
npm run dev
```

### 5. Test the Fix
Try generating content again - the 500 error should be resolved!

## Alternative: Use Test Mode
If you don't want to set up OpenAI right now, you can modify the code to use a test mode. However, this requires code changes and won't provide real AI-generated content.

## Need Help?
- Check the full [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for detailed instructions
- Make sure your `.env.local` file is in the project root directory
- Ensure there are no spaces around the `=` in your environment variables
- Restart your development server after making changes

## Security Note
- Never commit your `.env.local` file to version control
- Keep your API keys secure and don't share them publicly 