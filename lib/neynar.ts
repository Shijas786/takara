import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { config } from './config';

// Initialize Neynar API client
const neynarClient = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY || ''
});

// Check if API key is configured
if (!process.env.NEYNAR_API_KEY) {
  console.warn('NEYNAR_API_KEY environment variable is not configured');
}

// Production-ready Neynar API utility functions
export const neynarHelpers = {
  // Get user by FID
  async getUserByFid(fid: number) {
    try {
      const response = await neynarClient.lookupUserByCustodyAddress({ custodyAddress: fid.toString() });
      return response;
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      throw error;
    }
  },

  // Get user by address
  async getUserByAddress(address: string) {
    try {
      const response = await neynarClient.lookupUserByCustodyAddress({ custodyAddress: address });
      return response;
    } catch (error) {
      console.error('Error fetching user by address:', error);
      throw error;
    }
  },

  // Get trending feed
  async getTrendingFeed(limit: number = 20) {
    try {
      const response = await neynarClient.fetchTrendingFeed({
        limit,
        timeWindow: '24h'
      });
      return response;
    } catch (error) {
      console.error('Error fetching trending feed:', error);
      throw error;
    }
  },

  // Publish a cast
  async publishCast(signerUuid: string, text: string, parentHash?: string) {
    try {
      const response = await neynarClient.publishCast({
        signerUuid,
        text,
        ...(parentHash && { parent: parentHash })
      });
      return response;
    } catch (error) {
      console.error('Error publishing cast:', error);
      throw error;
    }
  },

  // Create a signer
  async createSigner(name: string, description?: string) {
    try {
      const response = await neynarClient.createSigner();
      return response;
    } catch (error) {
      console.error('Error creating signer:', error);
      throw error;
    }
  },

  // Get user casts
  async getUserCasts(fid: number, limit: number = 20) {
    try {
      const response = await neynarClient.fetchCastsForUser({
        fid,
        limit
      });
      return response;
    } catch (error) {
      console.error('Error fetching user casts:', error);
      throw error;
    }
  },

  // Search for users
  async searchUser(query: string) {
    try {
      const response = await neynarClient.searchUser({
        q: query
      });
      return response;
    } catch (error) {
      console.error('Error searching user:', error);
      throw error;
    }
  }
};

// Export individual functions for convenience
export const getUser = neynarHelpers.getUserByFid;
export const getTrendingFeed = neynarHelpers.getTrendingFeed;
export const publishCast = neynarHelpers.publishCast;
export const createSigner = neynarHelpers.createSigner;
export const getUserCasts = neynarHelpers.getUserCasts;

export default neynarHelpers; 