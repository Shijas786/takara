# 🚀 Web3 Shitpost Generator

A full-stack Web3 application that generates viral shitposts in the style of crypto influencers using AI, with direct posting to Farcaster via Soulbound NFTs on Base.

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Influencer Style Mimicking**: Generate posts in the style of top crypto/tech influencers
- **Style Mixing**: Combine two influencer styles for unique content
- **Multiple Post Types**: Shitpost, Copypasta, Roast, and Thread generation
- **Viral Score Analysis**: Real-time scoring based on emojis, hooks, and crypto slang

### 🔗 Web3 Integration
- **Wallet Connection**: Support for MetaMask, Base App, and other Web3 wallets
- **Soulbound NFT**: $5 SBT on Base chain for Farcaster posting privileges
- **Auto-Posting**: Scheduled posting for users with SBT
- **On-chain Verification**: Smart contract-based posting permissions

### 📊 Advanced Features
- **Copypasta Engine**: Generate degenerate CT slang content
- **Meme Generator**: Create image-based shitposts
- **AI Profile Roaster**: Roast influencers based on their past tweets
- **Thread Generator**: Multi-part viral threads
- **Viral Analytics**: Track engagement and performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Web3**: ethers.js + wagmi + RainbowKit
- **AI**: OpenAI GPT-4
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Base (Ethereum L2)
- **Social**: Farcaster API
- **UI**: Framer Motion + Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or Base App wallet
- OpenAI API key
- Supabase account
- Farcaster API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd web3-shitpost-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Web3 Configuration
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x... # Deploy contract first
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Farcaster Configuration
FARCASTER_API_KEY=your-farcaster-api-key
```

4. **Deploy the smart contract**
```bash
# Install Hardhat
npm install -g hardhat

# Deploy to Base
npx hardhat run contracts/deploy.js --network base
```

5. **Set up Supabase database**
- Create a new Supabase project
- Run the SQL schema from `supabase-schema.sql`
- Update your environment variables

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
web3-shitpost-generator/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── WalletConnect.tsx  # Wallet connection
│   ├── InfluencerSelector.tsx # Influencer selection
│   └── PostGenerator.tsx  # Post generation
├── lib/                   # Utility libraries
│   ├── config.ts          # App configuration
│   ├── web3.ts           # Web3 utilities
│   ├── openai.ts         # OpenAI service
│   ├── supabase.ts       # Database service
│   ├── farcaster.ts      # Farcaster API
│   └── viralScore.ts     # Viral scoring
├── contracts/             # Smart contracts
│   ├── SoulboundNFT.sol  # SBT contract
│   └── deploy.js         # Deployment script
├── types/                 # TypeScript types
│   └── index.ts          # Type definitions
├── supabase-schema.sql   # Database schema
└── package.json          # Dependencies
```

## 🔧 Smart Contract

### SoulboundNFT.sol
- **ERC-721 Soulbound Token** on Base chain
- **$5 mint price** (0.0025 ETH at current rates)
- **Non-transferable** - once minted, cannot be transferred
- **Posting privileges** - required for Farcaster posting
- **Max supply**: 10,000 tokens

### Key Functions
```solidity
function mint(address to) external payable
function hasPostingPrivileges(address user) external view returns (bool)
function getUserTokenId(address user) external view returns (uint256)
```

## 🎯 Usage Guide

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve connection in your wallet
- Switch to Base network if prompted

### 2. Mint SBT (Optional)
- Click "Mint SBT" to get posting privileges
- Pay 0.0025 ETH (~$5)
- Receive non-transferable Soulbound NFT

### 3. Select Influencer
- Browse through crypto/tech influencers
- Filter by category (Crypto, Tech, Farcaster)
- Search by name or handle
- Optionally select a second influencer for style mixing

### 4. Generate Content
- Choose post style (Shitpost, Copypasta, Roast, Thread)
- Set length (Short, Medium, Long)
- Add optional prompt/topic
- Click "Generate Shitpost"

### 5. Review & Post
- Edit generated content if needed
- View viral score breakdown
- Copy to clipboard or post directly to Farcaster (if SBT holder)

## 🎨 Customization

### Adding New Influencers
Edit `lib/config.ts`:
```typescript
export const influencers: Influencer[] = [
  {
    id: 'new-influencer',
    name: 'New Influencer',
    handle: '@newinfluencer',
    avatar: '/avatars/new-influencer.jpg',
    description: 'Description here',
    style: 'Style description',
    followers: 50000,
    category: 'crypto',
    sampleTweets: ['Sample tweet 1', 'Sample tweet 2']
  }
];
```

### Modifying Viral Score Algorithm
Edit `lib/viralScore.ts`:
```typescript
export const viralScoreWeights = {
  emoji: 0.3,    // Emoji weight
  hook: 0.4,     // Hook phrases weight
  slang: 0.3,    // Crypto slang weight
};
```

## 🔒 Security Features

- **Row Level Security** (RLS) in Supabase
- **Wallet-based authentication**
- **Smart contract verification**
- **Rate limiting** on API calls
- **Input validation** and sanitization

## 🚀 Deployment

### Vercel Deployment
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
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Base** for L2 infrastructure
- **Farcaster** for decentralized social
- **Supabase** for database and auth
- **Crypto Twitter** for inspiration

## 📞 Support

- **Discord**: [Join our community](https://discord.gg/...)
- **Twitter**: [@shitpostgen](https://twitter.com/shitpostgen)
- **Email**: support@shitpostgenerator.com

## 🔮 Roadmap

- [ ] **Meme Generator**: AI-powered meme creation
- [ ] **Thread Analytics**: Track thread performance
- [ ] **Community Features**: User profiles and leaderboards
- [ ] **Mobile App**: React Native version
- [ ] **Multi-chain Support**: Ethereum, Polygon, Arbitrum
- [ ] **Advanced AI**: Fine-tuned models for specific influencers
- [ ] **NFT Integration**: Generative profile pictures
- [ ] **Gamification**: Points, badges, and rewards

---

**Built with ❤️ for the crypto community**

*Generate viral content. Build in public. Stay based.* 🚀 