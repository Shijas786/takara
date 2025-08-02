# API Keys Setup Guide

This guide will help you set up all the required API keys for the Takara Content Evolution platform.

## Prerequisites

- Node.js and npm installed
- A code editor (VS Code recommended)
- Git for version control

## Environment Variables Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit the `.env.local` file** and add your actual API keys (see sections below for how to obtain each key).

## 1. OpenAI API Key

### How to Get OpenAI API Key:

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Give it a name (e.g., "Takara Content Evolution")
6. Copy the generated key

### Add to Environment:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
```

## 2. Farcaster API Keys

### How to Get Farcaster API Keys:

1. Go to [Farcaster Developer Portal](https://developer.farcaster.xyz/)
2. Sign in with your Farcaster account
3. Create a new application
4. Get your API key from the dashboard
5. For OAuth integration, you'll also need:
   - Client ID
   - Client Secret

### How to Get Neynar API Key:

1. Go to [Neynar Developer Portal](https://neynar.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Copy the generated key

**Note:** Neynar provides enhanced Farcaster API access with better rate limits and additional features.

### Add to Environment:
```env
FARCASTER_API_KEY=your_farcaster_api_key_here
NEXT_PUBLIC_FARCASTER_CLIENT_ID=your_farcaster_client_id_here
FARCASTER_CLIENT_SECRET=your_farcaster_client_secret_here
NEYNAR_API_KEY=your_neynar_api_key_here
```



## 4. Supabase Configuration

### How to Get Supabase Keys:

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy:
   - Project URL
   - Anon/Public Key

### Add to Environment:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 5. Contract Configuration

### Add to Environment:
```env
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

## 6. App Configuration

### Add to Environment:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Takara Content Evolution
NEXT_PUBLIC_ICON_URL=https://your-icon-url.com/icon.png
```

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use different API keys for development and production**
3. **Set appropriate IP whitelists for API keys**
4. **Use the minimum required permissions for each API key**
5. **Regularly rotate your API keys**
6. **Monitor API usage to detect unusual activity**

## Testing Your Setup

After setting up all keys, you can test the configuration:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check the console for any configuration errors**

3. **Test each integration:**
   - OpenAI: Try generating content
   - Farcaster: Try connecting your account
   
   - Supabase: Verify database connection

## Troubleshooting

### Common Issues:

1. **"API key not configured" errors:**
   - Ensure all required environment variables are set
   - Check for typos in the variable names
   - Restart the development server after adding new variables

2. **CORS errors:**
   - Ensure your app URL is correctly configured
   - Check that API endpoints are properly configured

3. **Authentication errors:**
   - Verify API keys are correct
   - Check if keys have expired
   - Ensure proper permissions are set

4. **Rate limiting:**
   - Check your API usage limits
   - Implement proper error handling for rate limits

## Production Deployment

When deploying to production:

1. **Set environment variables in your hosting platform:**
   - Vercel: Use the Environment Variables section
   - Netlify: Use the Environment Variables section
   - Railway: Use the Variables section

2. **Update URLs:**
   - Change `NEXT_PUBLIC_APP_URL` to your production domain
   - Update any callback URLs in your API configurations

3. **Security:**
   - Use production API keys (not development ones)
   - Set up proper CORS configurations
   - Enable HTTPS

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Test each API integration individually
4. Check the respective API documentation for troubleshooting guides

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Farcaster Developer Documentation](https://developer.farcaster.xyz/)

- [Supabase Documentation](https://supabase.com/docs) 