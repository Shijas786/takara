# 🚀 Deployment Guide

This guide will walk you through deploying the Web3 Shitpost Generator to production.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] **Node.js 18+** installed
- [ ] **Git** installed
- [ ] **MetaMask** or Base App wallet with ETH on Base
- [ ] **OpenAI API key** (paid account)
- [ ] **Neon Database account** (free tier works)
- [ ] **Farcaster API key** (optional for testing)

## 🔧 Step 1: Smart Contract Deployment

### 1.1 Install Hardhat
```bash
npm install -g hardhat
```

### 1.2 Create Hardhat Configuration
Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84531,
    },
  },
};
```

### 1.3 Install Dependencies
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### 1.4 Set Environment Variables
Create `.env` file:
```env
PRIVATE_KEY=your-wallet-private-key
```

### 1.5 Deploy Contract
```bash
# Test on Base Goerli first
npx hardhat run contracts/deploy.js --network baseGoerli

# Deploy to Base mainnet
npx hardhat run contracts/deploy.js --network base
```

### 1.6 Verify Contract
```bash
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

## 🗄️ Step 2: Neon Database Setup

### 2.1 Create Neon Project
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create new project
3. Note your connection string

### 2.2 Run Database Schema
1. Go to SQL Editor in Neon dashboard
2. Copy and paste the contents of `neon-schema.sql`
3. Execute the SQL

### 2.3 Configure Database Access
The schema includes basic tables, but you may need to adjust them based on your auth setup.

## 🤖 Step 3: OpenAI Setup

### 3.1 Get API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account and add billing
3. Generate API key

### 3.2 Test API
```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

## 🔗 Step 4: Farcaster Setup (Optional)

### 4.1 Get API Key
1. Go to [farcaster.xyz](https://farcaster.xyz)
2. Create account and get API key
3. Note your FID (Farcaster ID)

### 4.2 Test API
```bash
curl -X GET "https://api.farcaster.xyz/v2/users/YOUR_FID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 🌐 Step 5: Frontend Deployment

### 5.1 Environment Variables
Create `.env.local`:
```env
# Web3 Configuration
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Neon Database Configuration
DATABASE_URL=your_neon_database_connection_string

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Farcaster Configuration
FARCASTER_API_KEY=your-farcaster-api-key

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
```

### 5.2 Vercel Deployment (Recommended)

#### 5.2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard

#### 5.2.2 Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5.3 Manual Deployment

#### 5.3.1 Build
```bash
npm run build
```

#### 5.3.2 Start Production Server
```bash
npm start
```

### 5.4 Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t shitpost-generator .
docker run -p 3000:3000 shitpost-generator
```

## 🔍 Step 6: Testing

### 6.1 Smart Contract Testing
```bash
# Run tests
npx hardhat test

# Test on local network
npx hardhat node
npx hardhat run contracts/deploy.js --network localhost
```

### 6.2 Frontend Testing
```bash
# Run tests
npm test

# E2E tests (if configured)
npm run test:e2e
```

### 6.3 Integration Testing
1. Connect wallet
2. Mint SBT
3. Generate post
4. Post to Farcaster
5. Verify on-chain

## 📊 Step 7: Monitoring

### 7.1 Analytics Setup
- **Google Analytics**: Track user behavior
- **PostHog**: Product analytics
- **Sentry**: Error tracking

### 7.2 Health Checks
Create API endpoints for monitoring:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      openai: 'connected',
              neon: 'connected',
      farcaster: 'connected'
    }
  });
}
```

### 7.3 Logging
Set up structured logging:
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

## 🔒 Step 8: Security

### 8.1 Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable encryption
- Rotate API keys regularly

### 8.2 Rate Limiting
Implement rate limiting for API endpoints:
```typescript
// lib/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 8.3 CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
```

## 🚀 Step 9: Production Checklist

- [ ] **Smart Contract**: Deployed and verified on Base
- [ ] **Database**: Neon schema applied
- [ ] **Environment Variables**: All configured
- [ ] **Domain**: Custom domain configured (optional)
- [ ] **SSL**: HTTPS enabled
- [ ] **Monitoring**: Analytics and error tracking
- [ ] **Backup**: Database backup strategy
- [ ] **Documentation**: API docs and user guide
- [ ] **Testing**: All features tested
- [ ] **Performance**: Optimized for production

## 🔧 Step 10: Maintenance

### 10.1 Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update smart contract (if needed)
npx hardhat run contracts/deploy.js --network base
```

### 10.2 Database Maintenance
- Monitor Supabase usage
- Optimize queries
- Archive old data

### 10.3 API Monitoring
- Monitor OpenAI usage
- Track Farcaster API limits
- Monitor Base network fees

## 🆘 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check gas fees on Base
   - Verify private key format
   - Ensure sufficient ETH balance

2. **OpenAI API Errors**
   - Check API key validity
   - Monitor usage limits
   - Verify billing status

3. **Neon Database Connection Issues**
   - Check project URL and key
   - Verify RLS policies
   - Check database status

4. **Wallet Connection Problems**
   - Test with different wallets
   - Check network configuration
   - Verify contract address

### Support Resources
- **Discord**: Community support
- **GitHub Issues**: Bug reports
- **Documentation**: API docs
- **Stack Overflow**: General questions

---

**Happy deploying! 🚀**

*Remember: Test thoroughly on testnets before mainnet deployment.* 