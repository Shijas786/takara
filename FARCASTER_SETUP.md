# Farcaster API Setup - Fix QR Code Issue

## The Problem
Your QR code is not showing because the Farcaster API key is not properly configured. The app was previously using Neynar API, but we've updated it to use the official Farcaster API.

## Quick Fix

### 1. Get Your Farcaster API Key

1. Go to [Farcaster Developer Portal](https://developer.farcaster.xyz/)
2. Sign in with your Farcaster account
3. Create a new application or use an existing one
4. Copy your API key from the dashboard

### 2. Update Your Environment Variables

Edit your `.env.local` file and replace the placeholder values:

```env
# Replace this line:
FARCASTER_API_KEY=your_farcaster_api_key_here

# With your actual API key:
FARCASTER_API_KEY=fc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test the QR Code

1. Go to your app: http://localhost:3000
2. Generate some content
3. Click "Connect & Post" button
4. The QR code should now appear!

## Alternative: Use the Test Page

You can also test the QR functionality directly:

1. Go to: http://localhost:3000/test-qr.html
2. Click "Generate QR Code"
3. Scan with your Warpcast app

## Troubleshooting

### If you still don't see the QR code:

1. **Check the browser console** (F12) for error messages
2. **Verify your API key** is correct and not a placeholder
3. **Check the server logs** for any API errors
4. **Make sure you're using the official Farcaster API key**, not Neynar

### Common Error Messages:

- `"FARCASTER_API_KEY not configured"` - You need to set up your API key
- `"Failed to generate QR code"` - Check your API key format
- `"Invalid response format"` - API endpoint issue

### API Key Format

Your Farcaster API key should look like:
```
fc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## What Changed

- **Before**: Used Neynar API (`NEYNAR_API_KEY`)
- **After**: Uses official Farcaster API (`FARCASTER_API_KEY`)
- **Benefit**: More reliable, official API endpoints

## Need Help?

1. Check the [Farcaster Developer Documentation](https://developer.farcaster.xyz/)
2. Verify your API key at the [Farcaster Developer Portal](https://developer.farcaster.xyz/)
3. Look at the server console for detailed error messages

## Next Steps

Once the QR code is working:
1. Scan it with your Warpcast app
2. Approve the connection
3. You'll be able to post content directly to Farcaster! 