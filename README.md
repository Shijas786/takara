# 🦋 Kai - AI-Powered Content Evolution Platform

**Transform ordinary content into viral success with AI-powered content evolution. Built for Base Wallet and Farcaster.**

## ✨ Features

### 🎯 Content Enhancement
- **AI-Powered Evolution**: Transform your ideas, thoughts, and replies using real styles from top crypto influencers
- **Multiple Styles**: Choose from various content styles including:
  - **Shitpost Generator**: Create viral, engaging content
  - **BASED Content**: Generate authentic, community-focused posts
  - **Reply Guy**: Craft perfect responses and interactions
  - **Influencer Style**: Mimic top crypto influencer writing styles
  - **Thread Generator**: Create engaging multi-part content
- **Viral Score**: Get instant feedback on content potential
- **Real Training Data**: Trained on 916+ latest tweets from Base chain influencers

### 🔗 Platform Integration
- **Base Mini App**: Native integration with Base Wallet
- **Farcaster Integration**: Direct posting to Farcaster with OAuth authentication
- **Auto-Posting**: Schedule and automate content posting
- **MiniKit Integration**: Full MiniKit support for seamless wallet experience

### 🎨 Beautiful 3D UI
- **Interactive 3D Animations**: Floating particles, gradient orbs, and dynamic effects
- **Base Blue Theme**: Consistent Base chain branding
- **Responsive Design**: Works perfectly on all devices
- **Glass Morphism**: Modern, elegant UI with backdrop blur effects

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Base Wallet (for Mini App features)
- Farcaster account (for posting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kai
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
   OPENAI_API_KEY=your_openai_api_key
   FARCASTER_CLIENT_ID=your_farcaster_client_id
   FARCASTER_CLIENT_SECRET=your_farcaster_client_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
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
- **Framer Motion**: Smooth animations

### Blockchain & Web3
- **Base MiniKit**: Base Wallet integration
- **Farcaster API**: Social media integration
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum

### AI & Backend
- **OpenAI GPT-3.5**: Content generation
- **Supabase**: Database and authentication
- **Next.js API Routes**: Backend functionality

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 📱 Usage

### Content Enhancement
1. **Select Style**: Choose from available content styles
2. **Input Content**: Paste your idea, thought, or reply
3. **Generate**: Click "Kai Your Content" to evolve your text
4. **Review**: Check the viral score and generated content
5. **Post**: Connect Farcaster and post directly

### Auto-Posting
1. **Connect Farcaster**: Authenticate with your Farcaster account
2. **Configure Settings**: Set daily limits, schedule, and preferences
3. **Enable**: Turn on auto-posting for automated content evolution
4. **Monitor**: Track performance and adjust settings

### Mini App Features
- **Add to Mini Apps**: Install Kai as a Base Wallet Mini App
- **Notifications**: Get alerts for content completion
- **Profile View**: Access your Farcaster profile directly
- **Seamless Integration**: Native Base Wallet experience

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom 3D animations. Key files:
- `app/globals.css`: Global styles and animations
- `app/page.tsx`: Main UI components
- `tailwind.config.js`: Tailwind configuration

### Content Styles
Add new content styles in:
- `lib/openai.ts`: AI generation functions
- `types/index.ts`: TypeScript interfaces
- `lib/tweetTrainingData.ts`: Training data

### 3D Animations
Customize animations in:
- `app/page.tsx`: Animation keyframes and effects
- CSS classes: `animate-float-3d`, `animate-orb-3d`, etc.

## 🔧 Configuration

### Environment Variables
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Farcaster
FARCASTER_CLIENT_ID=your_client_id
FARCASTER_CLIENT_SECRET=your_client_secret

# Supabase (optional for offline mode)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Base MiniKit
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### MiniKit Configuration
Configure MiniKit settings in `app/providers.tsx`:
```typescript
<MiniKitProvider
  appName="Kai"
  appDescription="AI-powered content evolution"
  appIcon="🦋"
  appUrl="https://your-domain.com"
>
```

## 📊 Project Structure

```
kai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ContentEnhancer.tsx
│   ├── AutoPostManager.tsx
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── openai.ts         # AI integration
│   ├── farcaster.ts      # Farcaster API
│   └── config.ts         # Configuration
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Team**: For the amazing MiniKit platform
- **Farcaster Team**: For the decentralized social protocol
- **OpenAI**: For powerful AI capabilities
- **Crypto Influencers**: For providing training data and inspiration

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and feature requests on GitHub
- **Discord**: Join our community for discussions
- **Email**: Contact us at support@kai.app

---

**Built with ❤️ for the Base and Farcaster communities**

*Kai - Where content evolves to viral potential* 🦋 