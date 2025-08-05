# Warpcast Mini App Setup Guide

This guide will help you deploy your Takara Content Evolution app as a Warpcast Mini App.

## 🎯 What We've Built

A **Warpcast Mini App** that provides:
- **AI-powered content generation** using OpenAI
- **Direct posting to Farcaster** via Warpcast
- **User authentication** (automatic via Warpcast context)
- **Content enhancement** and optimization
- **Quick action templates** for common post types

### 📁 **Component Files:**
- `components/WarpcastMiniApp.tsx` - Demo version (works in browser)
- `components/WarpcastMiniAppReal.tsx` - Production version (uses real Warpcast SDK)

## 🚀 Benefits of Mini App Approach

### ✅ **Advantages:**
- **Free posting capability** - No paid API plans needed
- **Native Warpcast integration** - Seamless user experience
- **Automatic authentication** - No complex auth flows
- **Direct access to user data** - FID, username, profile picture
- **Better discoverability** - Users can find your app in Warpcast
- **Mobile-first experience** - Optimized for mobile users

### 🔧 **Technical Benefits:**
- **No authentication complexity** - Uses Warpcast context
- **No API rate limits** - Direct posting through Warpcast
- **No paid plans required** - Everything works with free APIs
- **Simpler deployment** - Standard web app deployment

## 📋 Prerequisites

1. **Warpcast Account** - You need a Warpcast account to test
2. **Deployed Web App** - Your app needs to be live on a public URL
3. **Valid Domain** - HTTPS required for Mini Apps
4. **Mini App Manifest** - Already created in `app/farcaster-manifest.json`

## 🛠️ Setup Steps

### 1. Switch to Production Mode

Before deploying, switch to the production Mini App component:

```typescript
// In app/page.tsx, change:
import WarpcastMiniApp from '../components/WarpcastMiniApp';
// To:
import WarpcastMiniApp from '../components/WarpcastMiniAppReal';
```

### 2. Deploy Your App

Deploy your app to a platform like Vercel:

```bash
# Deploy to Vercel
vercel --prod

# Or deploy to any other platform
npm run build
npm run start
```

### 2. Update Manifest File

Update `app/farcaster-manifest.json` with your actual domain:

```json
{
  "name": "Takara Content Evolution",
  "description": "AI-powered content creation and posting for Farcaster",
  "icon": "https://your-actual-domain.com/icon.png",
  "url": "https://your-actual-domain.com",
  "app": {
    "type": "web",
    "permissions": [
      "user:read",
      "cast:read", 
      "cast:write"
    ]
  },
  "frame": {
    "image": "https://your-actual-domain.com/frame-image.png",
    "postUrl": "https://your-actual-domain.com/frame"
  }
}
```

### 3. Create Required Assets

Create these assets and upload them to your domain:

- **Icon**: `icon.png` (512x512px recommended)
- **Frame Image**: `frame-image.png` (1200x630px for social sharing)

### 4. Submit to Warpcast

1. **Go to [Warpcast Developer Portal](https://developer.warpcast.com)**
2. **Sign in with your Warpcast account**
3. **Click "Create Mini App"**
4. **Fill in the details:**
   - Name: "Takara Content Evolution"
   - Description: "AI-powered content creation for Farcaster"
   - URL: Your deployed app URL
   - Icon: Your icon URL
   - Permissions: Select the required permissions
5. **Submit for review**

### 5. Test Your Mini App

Once approved:

1. **Open Warpcast mobile app**
2. **Go to the Mini Apps section**
3. **Find and open your app**
4. **Test the functionality:**
   - User authentication
   - Content generation
   - Direct posting

## 🔧 Configuration

### Environment Variables

Make sure these are set in your deployment:

```bash
# OpenAI API Key (for content generation)
OPENAI_API_KEY=your_openai_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Neynar Client ID (for Mini App SDK)
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id
```

### Mini App Permissions

Your app requests these permissions:

- **`user:read`** - Access to user profile data
- **`cast:read`** - Read user's casts
- **`cast:write`** - Post new casts

## 🎨 Features

### **Content Generation**
- AI-powered content enhancement
- Viral content suggestions
- Character limit optimization

### **Quick Actions**
- Pre-built templates for common post types
- One-click content generation
- Emoji suggestions

### **Direct Posting**
- Seamless posting to Farcaster
- No authentication required
- Instant publishing

### **User Experience**
- Native Warpcast integration
- Mobile-optimized interface
- Real-time feedback

## 🚀 Deployment Checklist

- [ ] App deployed to public URL
- [ ] HTTPS enabled
- [ ] Manifest file updated with correct URLs
- [ ] Assets (icon, frame image) uploaded
- [ ] Environment variables configured
- [ ] Mini App submitted to Warpcast
- [ ] Tested in Warpcast mobile app
- [ ] Content generation working
- [ ] Direct posting working

## 🔍 Testing

### **Local Testing**
```bash
npm run dev
# Open in browser and test functionality
```

### **Production Testing**
1. Deploy to production
2. Test all features
3. Verify Mini App integration
4. Test posting functionality

## 📱 User Experience

### **How Users Will Use Your App:**

1. **Open Warpcast mobile app**
2. **Navigate to Mini Apps**
3. **Find "Takara Content Evolution"**
4. **Start typing their post**
5. **Click "Enhance & Post"**
6. **AI enhances their content**
7. **Post goes live on Farcaster**

### **Key Features:**
- **No sign-up required** - Uses Warpcast account
- **Instant posting** - No complex flows
- **AI enhancement** - Better content automatically
- **Mobile optimized** - Perfect for mobile users

## 🎯 Next Steps

1. **Deploy your app** to a public URL
2. **Update the manifest** with your domain
3. **Submit to Warpcast** for approval
4. **Test thoroughly** in the mobile app
5. **Share with users** and get feedback

## 🆘 Troubleshooting

### **Common Issues:**

1. **App not loading in Warpcast**
   - Check HTTPS is enabled
   - Verify manifest file is correct
   - Ensure app is publicly accessible

2. **Posting not working**
   - Check Mini App permissions
   - Verify Warpcast SDK integration
   - Test in mobile app (not browser)

3. **Content generation failing**
   - Check OpenAI API key
   - Verify API endpoint is working
   - Check network connectivity

### **Support:**
- [Warpcast Developer Documentation](https://developer.warpcast.com)
- [Neynar Mini App SDK](https://docs.neynar.com/docs/mini-app-authentication)
- [Farcaster Protocol](https://docs.farcaster.xyz/)

## 🎉 Success!

Once deployed and approved, your Mini App will be available to all Warpcast users, providing them with AI-powered content creation directly within the Farcaster ecosystem! 