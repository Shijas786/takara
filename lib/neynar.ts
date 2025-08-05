import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

// Initialize Neynar API client
export const getNeynarClient = () => {
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    throw new Error('NEYNAR_API_KEY environment variable is required');
  }
  
  const config = new Configuration({
    apiKey: apiKey,
    baseOptions: {
      headers: {
        "x-neynar-experimental": true,
      },
    },
  });
  
  return new NeynarAPIClient(config);
};

// EIP-712 constants for signer registration
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: 'Farcaster SignedKeyRequestValidator',
  version: '1',
  chainId: 10,
  verifyingContract: '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`,
};

export const SIGNED_KEY_REQUEST_TYPE = [
  { name: 'requestFid', type: 'uint256' },
  { name: 'key', type: 'bytes' },
  { name: 'deadline', type: 'uint256' },
];

// Storage key for authentication state
export const STORAGE_KEY = 'neynar_authenticated_user';

// Authentication state interface
export interface StoredAuthState {
  isAuthenticated: boolean;
  user: {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    custody_address: string;
    profile: {
      bio: { text: string };
      location?: any;
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: {
      eth_addresses: string[];
      sol_addresses: string[];
      primary: {
        eth_address: string;
        sol_address: string;
      };
    };
    power_badge: boolean;
    score: number;
  } | null;
  signers: {
    object: 'signer';
    signer_uuid: string;
    public_key: string;
    status: 'approved';
    fid: number;
  }[];
}

// Utility functions for localStorage
export const getStoredAuth = (): StoredAuthState | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading stored auth:', error);
    return null;
  }
};

export const setStoredAuth = (authState: StoredAuthState) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Error storing auth:', error);
  }
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored auth:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const storedAuth = getStoredAuth();
  return storedAuth?.isAuthenticated === true && 
         storedAuth?.signers?.some(s => s.status === 'approved') === true;
};

// Get active signer
export const getActiveSigner = () => {
  const storedAuth = getStoredAuth();
  return storedAuth?.signers?.find(s => s.status === 'approved');
}; 