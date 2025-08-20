// Safe Farcaster SDK integration
let sdk: any = null;

// Check if we're in a Farcaster Mini App environment
function isFarcasterEnvironment() {
  if (typeof window === 'undefined') return false;
  
  // Check for Farcaster-specific environment variables or user agent
  const userAgent = window.navigator?.userAgent || '';
  const isInFarcaster = userAgent.includes('Farcaster') || 
                        userAgent.includes('farcaster') ||
                        window.location?.hostname?.includes('farcaster') ||
                        window.location?.hostname?.includes('warpcast');
  
  return isInFarcaster;
}

// Initialize SDK only when needed and safe
async function getSDK() {
  // Only run on client side
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Only initialize in Farcaster environment
  if (!isFarcasterEnvironment()) {
    console.log('Not in Farcaster environment, skipping SDK initialization');
    return null;
  }
  
  try {
    if (!sdk) {
      const mod = await import('@farcaster/miniapp-sdk');
      sdk = mod.sdk;
      
      // Verify SDK is properly initialized
      if (!sdk || !sdk.quickAuth) {
        console.log('Farcaster SDK not properly initialized');
        return null;
      }
    }
    return sdk;
  } catch (error) {
    console.error('Failed to load Farcaster SDK:', error);
    return null;
  }
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

      // Check if quickAuth is available
      if (!farcasterSDK.quickAuth || typeof farcasterSDK.quickAuth.getToken !== 'function') {
        console.log('Quick Auth not available in this environment');
        return null;
      }

      // Get Quick Auth token with proper error handling
      let token;
      try {
        const tokenResult = await farcasterSDK.quickAuth.getToken();
        token = tokenResult?.token;
        if (!token) {
          console.log('No token received from Quick Auth');
          return null;
        }
      } catch (tokenError) {
        console.log('Quick Auth token error:', tokenError);
        return null;
      }
      
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

      // Check if quickAuth is available
      if (!farcasterSDK.quickAuth || typeof farcasterSDK.quickAuth.getToken !== 'function') {
        console.log('Quick Auth not available in this environment');
        return { success: false, error: 'Quick Auth not available' };
      }

      // Get Quick Auth token with proper error handling
      let token;
      try {
        const tokenResult = await farcasterSDK.quickAuth.getToken();
        token = tokenResult?.token;
        if (!token) {
          console.log('No token received from Quick Auth');
          return { success: false, error: 'No authentication token' };
        }
      } catch (tokenError) {
        console.log('Quick Auth token error:', tokenError);
        return { success: false, error: 'Authentication failed' };
      }
      
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