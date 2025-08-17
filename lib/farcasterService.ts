import { sdk } from '@farcaster/miniapp-sdk';

export interface FarcasterUser {
  fid: number;
  primaryAddress?: string;
}

export interface CastData {
  text: string;
  parentHash?: string;
}

export class FarcasterService {
  /**
   * Get authenticated user info using Quick Auth
   */
  static async getAuthenticatedUser(): Promise<FarcasterUser | null> {
    try {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();
      
      // Make authenticated request to get user info
      const response = await sdk.quickAuth.fetch('/api/farcaster/me');
      
      if (response.ok) {
        const user = await response.json();
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting authenticated user:', error);
      return null;
    }
  }

  /**
   * Post a cast using the authenticated user's session
   */
  static async postCast(castData: CastData): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();
      
      // Post cast using authenticated request
      const response = await sdk.quickAuth.fetch('/api/farcaster/post-cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(castData),
      });
      
      if (response.ok) {
        const result = await response.json();
        return { success: true, hash: result.hash };
      } else {
        const error = await response.text();
        return { success: false, error };
      }
    } catch (error) {
      console.error('Error posting cast:', error);
      return { success: false, error: 'Failed to post cast' };
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getAuthenticatedUser();
      return user !== null;
    } catch {
      return false;
    }
  }

  /**
   * Initialize the app and hide splash screen
   */
  static async ready(): Promise<void> {
    try {
      await sdk.actions.ready();
    } catch (error) {
      console.error('Error calling ready:', error);
    }
  }
} 