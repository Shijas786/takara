# MiniKit Setup Guide

Your app has been converted to a proper **Base Mini App** using MiniKit! Here's how to set it up:

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with:

```bash
# MiniKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Content Enhancer
NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png
NEXT_PUBLIC_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here

# Farcaster Configuration (for OAuth flow)
NEXT_PUBLIC_FARCASTER_CLIENT_ID=your_farcaster_client_id
FARCASTER_CLIENT_SECRET=your_farcaster_client_secret

# Supabase Configuration (optional)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 2. Get Your MiniKit API Key

1. Go to the [Coinbase Developer Platform](https://developer.coinbase.com/)
2. Sign up for a CDP account
3. Navigate to API Keys → Client API Key
4. Copy your API key and add it to `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see your mini app!

## 📱 Mini App Features

Your app now includes all the MiniKit features:

- ✅ **Frame Ready**: Automatically sets frame ready state
- ✅ **Add Frame**: Users can add your app to their mini apps list
- ✅ **Primary Button**: "ENHANCE CONTENT" button at the bottom
- ✅ **Close Button**: Users can close the frame
- ✅ **Profile View**: View user's Farcaster profile
- ✅ **Notifications**: Send notifications to users who added your frame
- ✅ **External Links**: Open URLs outside the frame

## 🚀 Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

## 📋 Create Manifest

After deploying, create your frame manifest:

```bash
npx create-onchain --manifest
```

This will:
- Open the manifest setup page
- Connect your Farcaster wallet
- Add your deployed URL
- Sign the manifest
- Update your environment variables

## 🎯 Mini App Capabilities

### Built-in Features:
- **AI Content Enhancement**: Transform crypto content with AI
- **Multiple Styles**: Viral shitpost, BASED, Influencer, Thread, Reply Guy
- **Viral Scoring**: AI-powered viral potential scoring
- **Auto-Posting**: Schedule automatic content posting
- **Farcaster Integration**: Post directly to Farcaster

### MiniKit Integration:
- **Frame Management**: Proper frame lifecycle management
- **User Engagement**: Add to mini apps, notifications, profile viewing
- **Navigation**: Close frame, open external links
- **Primary Actions**: Global enhance content button

## 🔧 Development

The app structure follows MiniKit best practices:

- `app/providers.tsx`: MiniKit provider setup
- `app/page.tsx`: Main mini app with all MiniKit hooks
- `components/ContentEnhancer.tsx`: AI content enhancement logic
- MiniKit hooks: `useMiniKit`, `useAddFrame`, `useOpenUrl`, `useClose`, `usePrimaryButton`, `useViewProfile`, `useNotification`

## 📚 Resources

- [Base MiniKit Documentation](https://docs.base.org/base-app/build-with-minikit/quickstart)
- [Coinbase Developer Platform](https://developer.coinbase.com/)
- [Farcaster Developer Docs](https://docs.farcaster.xyz/)

Your app is now a fully functional Base mini app! 🎉 