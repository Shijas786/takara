import { config } from './config';



class NeynarService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.farcaster.neynarApiKey;
    this.baseUrl = config.farcaster.neynarBaseUrl;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const headers: Record<string, string> = {
      'api_key': this.apiKey,
      'Content-Type': 'application/json',
    };

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Neynar API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Neynar API request failed:', error);
      throw error;
    }
  }

  /**
   * Get user information by FID
   */
  async getUserByFid(fid: number): Promise<any> {
    return this.makeRequest(`/farcaster/user?fid=${fid}`);
  }

  /**
   * Get user information by username (fname)
   */
  async getUserByUsername(username: string): Promise<any> {
    return this.makeRequest(`/farcaster/user?fname=${username}`);
  }

  /**
   * Get user information by wallet address
   */
  async getUserByWalletAddress(address: string): Promise<any> {
    return this.makeRequest(`/farcaster/user?address=${address}`);
  }

  /**
   * Get user's casts
   */
  async getUserCasts(fid: number, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/casts?fid=${fid}&limit=${limit}`);
  }

  /**
   * Get user's followers
   */
  async getUserFollowers(fid: number, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/followers?fid=${fid}&limit=${limit}`);
  }

  /**
   * Get user's following
   */
  async getUserFollowing(fid: number, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/following?fid=${fid}&limit=${limit}`);
  }

  /**
   * Get trending feed
   */
  async getTrendingFeed(limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/feed/trending?limit=${limit}`);
  }

  /**
   * Get channel feed
   */
  async getChannelFeed(channelId: string, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/feed/channel?channel_id=${channelId}&limit=${limit}`);
  }

  /**
   * Search for users
   */
  async searchUsers(query: string, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Get notifications for a user
   */
  async getNotifications(fid: number, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/notifications?fid=${fid}&limit=${limit}`);
  }

  /**
   * Get mutual followers between two users
   */
  async getMutualFollowers(fid1: number, fid2: number, limit: number = 25): Promise<any> {
    return this.makeRequest(`/farcaster/mutual-followers?fid1=${fid1}&fid2=${fid2}&limit=${limit}`);
  }

  /**
   * Get signers for a user
   */
  async getSigners(fid: number): Promise<any> {
    return this.makeRequest(`/farcaster/signer?fid=${fid}`);
  }

  /**
   * Create a new signer for a user
   */
  async createSigner(fid: number): Promise<any> {
    return this.makeRequest('/farcaster/signer', 'POST', { fid });
  }

  /**
   * Post a cast to Farcaster
   */
  async postCast(signerUuid: string, text: string, replyTo?: string, channelId?: string): Promise<any> {
    const body: any = {
      signer_uuid: signerUuid,
      text: text,
    };

    if (replyTo) {
      body.parent = replyTo;
    }

    if (channelId) {
      body.channel_id = channelId;
    }

    return this.makeRequest('/farcaster/cast', 'POST', body);
  }

  /**
   * Get cast by hash
   */
  async getCast(hash: string): Promise<any> {
    return this.makeRequest(`/farcaster/cast?identifier=${hash}&type=hash`);
  }

  /**
   * Delete a cast
   */
  async deleteCast(signerUuid: string, castHash: string): Promise<any> {
    return this.makeRequest('/farcaster/cast', 'DELETE', {
      signer_uuid: signerUuid,
      cast_hash: castHash,
    });
  }

  /**
   * Like a cast
   */
  async likeCast(signerUuid: string, castHash: string): Promise<any> {
    return this.makeRequest('/farcaster/reaction', 'POST', {
      signer_uuid: signerUuid,
      cast_hash: castHash,
      reaction_type: 'like',
    });
  }

  /**
   * Unlike a cast
   */
  async unlikeCast(signerUuid: string, castHash: string): Promise<any> {
    return this.makeRequest('/farcaster/reaction', 'DELETE', {
      signer_uuid: signerUuid,
      cast_hash: castHash,
      reaction_type: 'like',
    });
  }

  /**
   * Follow a user
   */
  async followUser(signerUuid: string, targetFid: number): Promise<any> {
    return this.makeRequest('/farcaster/follow', 'POST', {
      signer_uuid: signerUuid,
      target_fid: targetFid,
    });
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(signerUuid: string, targetFid: number): Promise<any> {
    return this.makeRequest('/farcaster/follow', 'DELETE', {
      signer_uuid: signerUuid,
      target_fid: targetFid,
    });
  }

  /**
   * Get user's signers
   */
  async getUserSigners(fid: number): Promise<any> {
    return this.makeRequest(`/farcaster/signer?fid=${fid}`);
  }

  /**
   * Validate a signer
   */
  async validateSigner(signerUuid: string): Promise<any> {
    return this.makeRequest(`/farcaster/signer?signer_uuid=${signerUuid}`);
  }
}

export const neynarService = new NeynarService();
export default neynarService; 