import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Initialize Neynar API client
const neynarClient = new NeynarAPIClient({ 
  apiKey: process.env.NEYNAR_API_KEY || '' 
});

// Check if API key is configured
if (!process.env.NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY environment variable is required');
}

// Production-ready Neynar API utility functions
export const neynarHelpers = {
  // Get user by FID
  async getUserByFid(fid: number) {
    try {
      const response = await neynarClient.lookupUserByCustodyAddress({ custodyAddress: fid.toString() });
      return response;
    } catch (error: any) {
      console.error('Error fetching user by FID:', error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },

  // Get user by wallet address
  async getUserByAddress(address: string) {
    try {
      const response = await neynarClient.lookupUserByCustodyAddress({ custodyAddress: address });
      return response;
    } catch (error: any) {
      console.error('Error fetching user by address:', error);
      throw new Error(`Failed to fetch user by address: ${error.message}`);
    }
  },

  // Get trending feed
  async getTrendingFeed() {
    try {
      const response = await neynarClient.fetchTrendingFeed({ 
        limit: 50
      });
      return response;
    } catch (error: any) {
      console.error('Error fetching trending feed:', error);
      throw new Error(`Failed to fetch trending feed: ${error.message}`);
    }
  },

  // Publish a cast
  async publishCast(signerUUID: string, text: string) {
    try {
      const response = await neynarClient.publishCast({
        signerUuid: signerUUID,
        text: text
      });
      return response;
    } catch (error: any) {
      console.error('Error publishing cast:', error);
      throw new Error(`Failed to publish cast: ${error.message}`);
    }
  },

  // Create a signer for a user
  async createSigner(fid: number) {
    try {
      const response = await neynarClient.createSigner();
      return response;
    } catch (error: any) {
      console.error('Error creating signer:', error);
      throw new Error(`Failed to create signer: ${error.message}`);
    }
  },

  // Get user casts
  async getUserCasts(fid: number, limit: number = 10) {
    try {
      const response = await neynarClient.fetchCastsForUser({
        fid: fid,
        limit: limit
      });
      return response;
    } catch (error: any) {
      console.error('Error fetching user casts:', error);
      throw new Error(`Failed to fetch user casts: ${error.message}`);
    }
  },

  // Search users
  async searchUsers(query: string, limit: number = 10) {
    try {
      const response = await neynarClient.searchUser({
        q: query,
        limit: limit
      });
      return response;
    } catch (error: any) {
      console.error('Error searching users:', error);
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }
};

// Export individual functions for direct use
export const getUser = neynarHelpers.getUserByFid;
export const getTrendingFeed = neynarHelpers.getTrendingFeed;
export const publishCast = neynarHelpers.publishCast;
export const createSigner = neynarHelpers.createSigner;

export default neynarHelpers; 