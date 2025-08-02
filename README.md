# 🦋 Takara - AI-Powered Content Evolution Platform

**Transform ordinary content into viral success with AI-powered content evolution. Built for Farcaster and Web3 communities.**

## ✨ Features

### 🎯 Content Enhancement
- **AI-Powered Evolution**: Transform your ideas, thoughts, and replies using real styles from top crypto influencers
- **Multiple Styles**: Choose from various content styles including:
  - **Viral Shitpost**: Create viral, engaging content
  - **BASED Content**: Generate authentic, community-focused posts
  - **Reply Guy**: Craft perfect responses and interactions
  - **Influencer Style**: Mimic top crypto influencer writing styles
  - **Thread Generator**: Create engaging multi-part content
- **Viral Score**: Get instant feedback on content potential with detailed scoring
- **Real Training Data**: Trained on 916+ authentic tweets from top crypto Twitter personalities

### 🔗 Platform Integration
- **Farcaster Integration**: Direct posting to Farcaster with Neynar authentication
- **Auto-Posting**: Schedule and automate content posting
- **Real-time Analytics**: Track your content performance
- **Multi-platform Ready**: Optimized for X, Web2, and Farcaster

### 🎨 Beautiful Modern UI
- **Interactive Animations**: Smooth transitions and dynamic effects
- **Dark Theme**: Elegant dark mode with purple accents
- **Responsive Design**: Works perfectly on all devices
- **Glass Morphism**: Modern, elegant UI with backdrop blur effects

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Farcaster account (for posting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shijas786/takara.git
   cd takara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   # Neynar (Farcaster)
   NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id
   NEYNAR_API_KEY=your_neynar_api_key
   NEYNAR_APP_MNEMONIC=your_neynar_app_mnemonic
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   
   
   # Supabase (optional)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Shadcn/ui**: Modern component library

### Blockchain & Web3
- **Neynar SDK**: Farcaster integration
- **Farcaster API**: Social media integration
- **Sign In With Neynar (SIWN)**: Authentication

### AI & Backend
- **OpenAI GPT-4**: Content generation
- **Supabase**: Database and authentication (optional)
- **Next.js API Routes**: Backend functionality

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Vercel**: Deployment platform

## 📱 Usage

### Content Enhancement
1. **Input Content**: Paste your idea, thought, or reply
2. **Select Style**: Choose from available content styles
3. **Generate**: Click "Takara Evolution" to evolve your text
4. **Review**: Check the viral score and generated content
5. **Post**: Connect Farcaster and post directly

### Auto-Posting
1. **Connect Farcaster**: Authenticate with your Farcaster account via Neynar
2. **Configure Settings**: Set daily limits, schedule, and preferences
3. **Enable**: Turn on auto-posting for automated content evolution
4. **Monitor**: Track performance and adjust settings

### Farcaster Integration
- **Sign In With Neynar**: Seamless Farcaster authentication
- **Direct Posting**: Post evolved content directly to Farcaster
- **Profile Management**: Access your Farcaster profile
- **Cast Management**: View and manage your casts

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom animations. Key files:
- `app/globals.css`: Global styles and animations
- `app/page.tsx`: Main UI components
- `tailwind.config.js`: Tailwind configuration

### Content Styles
Add new content styles in:
- `lib/openai.ts`: AI generation functions
- `types/index.ts`: TypeScript interfaces
- `lib/tweetTrainingData.ts`: Training data

### Animations
Customize animations in:
- `app/page.tsx`: Animation keyframes and effects
- CSS classes: `animate-float-3d`, `animate-orb-3d`, etc.

## 🔧 Configuration

### Environment Variables
```env
# Neynar (Farcaster)
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_client_id
NEYNAR_API_KEY=your_api_key
NEYNAR_APP_MNEMONIC=your_app_mnemonic

# OpenAI
OPENAI_API_KEY=sk-...




# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://takara-content-app.vercel.app
```

### Neynar Configuration
Configure Neynar settings in `app/ClientProviders.tsx`:
```typescript
<NeynarContextProvider
  settings={{
    clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
  }}
>
```

## 📊 Project Structure

```
takara/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── farcaster/     # Farcaster API routes
│   │   ├── openai/        # OpenAI API routes

│   │   └── supabase/      # Supabase API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ContentEnhancer.tsx
│   ├── AutoPostManager.tsx
│   ├── FarcasterAuth.tsx
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── openai.ts         # AI integration
│   ├── neynar.ts         # Neynar API

│   └── config.ts         # Configuration
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
└── public/               # Static assets
    └── .well-known/      # Farcaster manifest
```

## 🚀 Deployment

### Live Deployment
**Current Live URL**: [https://takara-content-app.vercel.app](https://takara-content-app.vercel.app)

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🔗 API Integration Status

### ✅ Working Integrations
- **OpenAI**: Content generation and enhancement
- **Neynar**: Farcaster authentication and posting
- **Farcaster**: Direct cast publishing
- **Auto-posting**: Scheduled content management

### 🔧 Optional Integrations

- **Supabase**: Database storage (configured but optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Neynar Team**: For the amazing Farcaster integration platform
- **Farcaster Team**: For the decentralized social protocol
- **OpenAI**: For powerful AI capabilities
- **Crypto Influencers**: For providing training data and inspiration

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and feature requests on GitHub
- **Live Demo**: [https://takara-content-app.vercel.app](https://takara-content-app.vercel.app)

---

**Built with ❤️ for the Farcaster and Web3 communities**

*Takara - Where content evolves to viral potential* 🦋 