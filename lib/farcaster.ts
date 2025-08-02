import { config } from './config';

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  custodyAddress: string;
  followerCount: number;
  followingCount: number;
  verifications: string[];
  activeStatus: string;
  signerUuid: string;
}

export interface FarcasterCast {
  hash: string;
  threadHash: string | null;
  parentHash: string | null;
  author: {
    fid: number;
    username: string;
    displayName: string;
    pfp: string;
  };
  text: string;
  timestamp: number;
  reactions: {
    likes: number;
    recasts: number;
    replies: number;
  };
  replies: FarcasterCast[];
}

export interface FarcasterSigner {
  signerUuid: string;
  publicKey: string;
  status: 'approved' | 'pending_approval' | 'pending_removal';
  keyType: 'ed25519' | 'eip191';
  metadata: {
    name: string;
    description?: string;
  };
}

class FarcasterAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.farcaster.baseUrl;
    this.apiKey = config.farcaster.apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Farcaster API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Farcaster API request failed:', error);
      throw error;
    }
  }

  // Get user by FID
  async getUserByFid(fid: number): Promise<FarcasterUser> {
    const data = await this.makeRequest(`/users/${fid}`);
    return data.user;
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<FarcasterUser> {
    const data = await this.makeRequest(`/users/${username}`);
    return data.user;
  }

  // Get user casts
  async getUserCasts(fid: number, limit: number = 20): Promise<FarcasterCast[]> {
    const data = await this.makeRequest(`/users/${fid}/casts?limit=${limit}`);
    return data.casts;
  }

  // Get trending casts
  async getTrendingCasts(limit: number = 20): Promise<FarcasterCast[]> {
    const data = await this.makeRequest(`/casts?limit=${limit}`);
    return data.casts;
  }

  // Post a cast
  async postCast(signerUuid: string, text: string, parentHash?: string): Promise<{ hash: string }> {
    const payload = {
      signer_uuid: signerUuid,
      text,
      ...(parentHash && { parent: { hash: parentHash } }),
    };

    const data = await this.makeRequest('/casts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return { hash: data.cast.hash };
  }

  // Create a signer
  async createSigner(name: string, description?: string): Promise<FarcasterSigner> {
    const payload = {
      name,
      ...(description && { description }),
    };

    const data = await this.makeRequest('/signers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return data.signer;
  }

  // Get signer status
  async getSignerStatus(signerUuid: string): Promise<FarcasterSigner> {
    const data = await this.makeRequest(`/signers/${signerUuid}`);
    return data.signer;
  }

  // Get signer QR code for approval
  async getSignerQR(signerUuid: string): Promise<{ qrCode: string; url: string }> {
    const data = await this.makeRequest(`/signers/${signerUuid}/qr`);
    return {
      qrCode: data.qr_code,
      url: data.url,
    };
  }

  // Delete a cast
  async deleteCast(signerUuid: string, castHash: string): Promise<void> {
    await this.makeRequest(`/casts/${castHash}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Signer-UUID': signerUuid,
      },
    });
  }

  // Like a cast
  async likeCast(signerUuid: string, castHash: string): Promise<void> {
    await this.makeRequest(`/casts/${castHash}/likes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Signer-UUID': signerUuid,
      },
    });
  }

  // Unlike a cast
  async unlikeCast(signerUuid: string, castHash: string): Promise<void> {
    await this.makeRequest(`/casts/${castHash}/likes`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Signer-UUID': signerUuid,
      },
    });
  }

  // Recast a cast
  async recastCast(signerUuid: string, castHash: string): Promise<void> {
    await this.makeRequest(`/casts/${castHash}/recasts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Signer-UUID': signerUuid,
      },
    });
  }

  // Get cast replies
  async getCastReplies(castHash: string, limit: number = 20): Promise<FarcasterCast[]> {
    const data = await this.makeRequest(`/casts/${castHash}/replies?limit=${limit}`);
    return data.casts;
  }
}

// Neynar API integration for enhanced functionality
class NeynarAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.farcaster.neynarBaseUrl;
    this.apiKey = config.farcaster.neynarApiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'api_key': this.apiKey,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Neynar API request failed:', error);
      throw error;
    }
  }

  // Get user by FID with enhanced data
  async getUserByFid(fid: number): Promise<FarcasterUser> {
    const data = await this.makeRequest(`/farcaster/user?fid=${fid}`);
    return data.user;
  }

  // Get user casts with enhanced data
  async getUserCasts(fid: number, limit: number = 20): Promise<FarcasterCast[]> {
    const data = await this.makeRequest(`/farcaster/casts?fid=${fid}&limit=${limit}`);
    return data.casts;
  }

  // Get trending casts
  async getTrendingCasts(limit: number = 20): Promise<FarcasterCast[]> {
    const data = await this.makeRequest(`/farcaster/trending?limit=${limit}`);
    return data.casts;
  }

  // Post a cast using Neynar
  async postCast(signerUuid: string, text: string, parentHash?: string): Promise<{ hash: string }> {
    const payload = {
      signer_uuid: signerUuid,
      text,
      ...(parentHash && { parent: { hash: parentHash } }),
    };

    const data = await this.makeRequest('/farcaster/cast', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return { hash: data.cast.hash };
  }
}

// Export instances
export const farcasterAPI = new FarcasterAPI();
export const neynarAPI = new NeynarAPI();

// Utility functions
export const farcasterUtils = {
  // Format timestamp to relative time
  formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  },

  // Truncate text for display
  truncateText(text: string, maxLength: number = 280): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },

  // Extract mentions from text
  extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  },

  // Extract hashtags from text
  extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1]);
    }
    return hashtags;
  },

  // Validate cast text
  validateCastText(text: string): { isValid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: 'Cast text cannot be empty' };
    }

    if (text.length > 320) {
      return { isValid: false, error: 'Cast text cannot exceed 320 characters' };
    }

    return { isValid: true };
  },
}; 