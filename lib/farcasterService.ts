// Dynamic import to avoid SSR issues
let sdk: any = null;

// Initialize SDK only when needed
async function getSDK() {
  if (!sdk) {
    try {
      const mod = await import('@farcaster/miniapp-sdk');
      sdk = mod.sdk;
    } catch (error) {
      console.error('Failed to load Farcaster SDK:', error);
      return null;
    }
  }
  return sdk;
}

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
      const farcasterSDK = await getSDK();
      if (!farcasterSDK) {
        console.log('Farcaster SDK not available');
        return null;
      }

      // Get Quick Auth token
      const { token } = await farcasterSDK.quickAuth.getToken();
      
      // Make authenticated request to get user info
      const response = await farcasterSDK.quickAuth.fetch('/api/farcaster/me');
      
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
      const farcasterSDK = await getSDK();
      if (!farcasterSDK) {
        console.log('Farcaster SDK not available');
        return { success: false, error: 'Farcaster SDK not available' };
      }

      // Get Quick Auth token
      const { token } = await farcasterSDK.quickAuth.getToken();
      
      // Post cast using authenticated request
      const response = await farcasterSDK.quickAuth.fetch('/api/farcaster/post-cast', {
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
      const farcasterSDK = await getSDK();
      if (!farcasterSDK) {
        console.log('Farcaster SDK not available');
        return;
      }
      await farcasterSDK.actions.ready();
    } catch (error) {
      console.error('Error calling ready:', error);
    }
  }
} 