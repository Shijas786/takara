export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  description: string;
  style: string;
  followers: number;
  category: 'crypto' | 'tech' | 'farcaster';
  sampleTweets: string[];
}

export interface GeneratedPost {
  id: string;
  content: string;
  influencer: Influencer;
  mixedInfluencer?: Influencer;
  viralScore: number;
  createdAt: Date;
  userId: string;
  isPosted: boolean;
  farcasterHash?: string;
  scheduledFor?: Date;
}

export interface User {
  id: string;
  farcasterFid: string;
  autoPostSettings: AutoPostSettings;
  createdAt: Date;
  lastActive: Date;
}

export interface AutoPostSettings {
  enabled: boolean;
  dailyLimit: number;
  scheduleTime: string;
  timezone: string;
  autoEnhance: boolean;
}

export interface ViralScoreBreakdown {
  emojiScore: number;
  hookScore: number;
  slangScore: number;
  totalScore: number;
}

export interface PostGenerationRequest {
  influencerId: string;
  mixedInfluencerId?: string;
  prompt?: string;
    style: 'shitpost' | 'based' | 'influencer' | 'thread' | 'reply';
  length: 'short' | 'medium' | 'long';
}

export interface FarcasterPost {
  text: string;
  embeds?: string[];
  replyTo?: string;
}

export interface AutoPostSchedule {
  id: string;
  userId: string;
  frequency: 'daily' | 'weekly' | 'custom';
  timeOfDay: string;
  daysOfWeek?: number[];
  isActive: boolean;
  createdAt: Date;
}

export interface MemeGenerationRequest {
  text: string;
  style: 'pepe' | 'wojak' | 'chad' | 'virgin';
  background?: string;
}

export interface ThreadPart {
  id: string;
  content: string;
  order: number;
}

export interface ThreadGenerationRequest {
  topic: string;
  influencerId: string;
  parts: number;
  style: 'educational' | 'story' | 'analysis';
}

export type Network = 'base' | 'ethereum' | 'polygon';

export interface ContractConfig {
  soulboundNFT: string;
  network: Network;
  chainId: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export interface AppConfig {
  contracts: ContractConfig;
  supabase: SupabaseConfig;
  openai: OpenAIConfig;
  farcaster: {
    apiKey: string;
    baseUrl: string;
  };
} 

// Extend Window interface for Web3 and Coinbase Wallet
declare global {
  interface Window {
    ethereum?: {
      isCoinbaseWallet?: boolean;
      request: (args: any) => Promise<any>;
      on: (event: string, callback: any) => void;
      removeListener: (event: string, callback: any) => void;
    };
    coinbaseWalletExtension?: any;
  }
} 