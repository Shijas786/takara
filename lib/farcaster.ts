import { config } from './config';
import { FarcasterPost } from '../types';

export class FarcasterService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.farcaster.baseUrl;
    this.apiKey = config.farcaster.apiKey;
  }

  async postToFarcaster(post: FarcasterPost): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/casts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text: post.text,
          embeds: post.embeds || [],
          reply_to: post.replyTo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Farcaster API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.hash; // Return the cast hash
    } catch (error) {
      console.error('Error posting to Farcaster:', error);
      throw new Error('Failed to post to Farcaster');
    }
  }

  async getCast(hash: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/casts/${hash}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Farcaster API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cast:', error);
      throw new Error('Failed to fetch cast');
    }
  }

  async getUserInfo(fid: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${fid}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Farcaster API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user info');
    }
  }

  async getCastsByUser(fid: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/casts?fid=${fid}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Farcaster API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.casts || [];
    } catch (error) {
      console.error('Error fetching user casts:', error);
      throw new Error('Failed to fetch user casts');
    }
  }

  // Helper method to format text for Farcaster
  formatTextForFarcaster(text: string): string {
    // Ensure text doesn't exceed Farcaster's limit
    const maxLength = 320;
    if (text.length <= maxLength) return text;

    // Truncate and add ellipsis
    return text.substring(0, maxLength - 3) + '...';
  }

  // Helper method to extract mentions from text
  extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  // Helper method to extract hashtags from text
  extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1]);
    }

    return hashtags;
  }

  // Helper method to validate post content
  validatePost(post: FarcasterPost): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!post.text || post.text.trim().length === 0) {
      errors.push('Post text cannot be empty');
    }

    if (post.text && post.text.length > 320) {
      errors.push('Post text exceeds 320 character limit');
    }

    if (post.embeds && post.embeds.length > 2) {
      errors.push('Maximum 2 embeds allowed per post');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const farcasterService = new FarcasterService(); 