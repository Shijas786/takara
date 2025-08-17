import { AppConfig, Influencer } from '../types';

export const config: AppConfig = {
  contracts: {
    soulboundNFT: process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    network: 'base',
    chainId: 8453, // Base mainnet
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost/placeholder',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'placeholder_openai_key',
    model: 'gpt-3.5-turbo',
  },
  farcaster: {
    neynarApiKey: process.env.NEYNAR_API_KEY || 'placeholder_neynar_key',
    neynarBaseUrl: 'https://api.neynar.com/v2',
  },

};

// Placeholder for fresh influencer data
export const influencers: Influencer[] = [
  {
    id: 'placeholder',
    name: 'Placeholder',
    handle: '@placeholder',
    avatar: '/avatars/placeholder.jpg',
    description: 'Placeholder for fresh training data',
    style: 'placeholder',
    followers: 0,
    category: 'crypto',
    sampleTweets: ['Ready for new training data']
  }
];

export const viralScoreWeights = {
  emoji: 0.3,
  hook: 0.4,
  slang: 0.3,
};

export const emojiScoreMap = {
  '🚀': 10,
  '💎': 8,
  '🔥': 7,
  '📈': 6,
  '💪': 5,
  '🎯': 4,
  '⚡': 3,
  '💯': 2,
  '😤': 1,
};

export const hookPhrases = [
  'wen',
  'ser',
  'anon',
  'gm',
  'wagmi',
  'ngmi',
  'fren',
  'based',
  'cope',
  'seethe',
  'mald',
  'ratio',
  'lfg',
  'fud',
  'fomo',
  'dyor',
  'hodl',
  'btfd',
  'rekt',
  'moon',
  'pump',
  'dump',
  'shill',
  'alpha',
  'beta',
  'gamma',
  'delta',
  'sigma',
  'chad',
  'virgin',
];

export const slangScoreMap = {
  'wen': 10,
  'ser': 8,
  'anon': 7,
  'gm': 6,
  'wagmi': 5,
  'ngmi': 4,
  'fren': 3,
  'based': 2,
  'cope': 1,
}; 