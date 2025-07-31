// Neynar API helper functions using direct fetch calls
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export const neynarHelpers = {
  // Get user by wallet address
  async getUserByAddress(address: string) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/bulk-by-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NEYNAR_API_KEY!,
        },
        body: JSON.stringify({
          addresses: [address],
        }),
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user by address:', error);
      throw error;
    }
  },

  // Get user by FID
  async getUserByFid(fid: number) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user?fid=${fid}`, {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      throw error;
    }
  },

  // Post a cast
  async postCast(signerUuid: string, text: string, parentUrl?: string) {
    try {
      const body: any = {
        signer_uuid: signerUuid,
        text: text,
      };

      if (parentUrl) {
        body.parent_url = parentUrl;
      }

      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NEYNAR_API_KEY!,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error posting cast:', error);
      throw error;
    }
  },

  // Get user's casts
  async getUserCasts(fid: number, limit: number = 10) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/casts?fid=${fid}&limit=${limit}`, {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user casts:', error);
      throw error;
    }
  },

  // Get trending feed
  async getTrendingFeed(limit: number = 10) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/feed/trending?limit=${limit}`, {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching trending feed:', error);
      throw error;
    }
  },

  // Search users by username
  async searchUsers(query: string, limit: number = 10) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get mutual followers
  async getMutualFollowers(fid1: number, fid2: number) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/mutual-followers?fid1=${fid1}&fid2=${fid2}`, {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching mutual followers:', error);
      throw error;
    }
  },

  // Get signers for a user
  async getSigners(fid: number) {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/signer?fid=${fid}`, {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching signers:', error);
      throw error;
    }
  },
}; 