'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

interface FarcasterLoginProps {
  onLogin: (user: FarcasterUser, signerUuid: string) => void;
  onLogout: () => void;
}

export default function FarcasterLogin({ onLogin, onLogout }: FarcasterLoginProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [signerUuid, setSignerUuid] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('farcaster_user');
    const storedSignerUuid = localStorage.getItem('farcaster_signer_uuid');
    
    if (storedUser && storedSignerUuid) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSignerUuid(storedSignerUuid);
        setIsLoggedIn(true);
        onLogin(userData, storedSignerUuid);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('farcaster_user');
        localStorage.removeItem('farcaster_signer_uuid');
      }
    }
  }, [onLogin]);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Get the base URL from environment
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Neynar Client ID not configured');
      }

      // Construct OAuth URL
      const redirectUri = `${baseUrl}/api/login/callback`;
      const scope = 'cast:read cast:write';
      const state = Math.random().toString(36).substring(7);
      
      // Store state for verification
      localStorage.setItem('oauth_state', state);
      
      const authUrl = `https://neynar.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code`;
      
      // Redirect to Neynar OAuth
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('farcaster_user');
    localStorage.removeItem('farcaster_signer_uuid');
    localStorage.removeItem('oauth_state');
    
    setUser(null);
    setSignerUuid('');
    setIsLoggedIn(false);
    onLogout();
  };

  if (isLoggedIn && user) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Connected to Farcaster</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-green-200">
          <img 
            src={user.pfp} 
            alt={user.displayName}
            className="w-12 h-12 rounded-full border-2 border-green-300"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{user.displayName}</h4>
            <p className="text-sm text-gray-600">@{user.username} (FID: {user.fid})</p>
            <div className="flex space-x-4 mt-1">
              <span className="text-xs text-gray-500">
                {user.followerCount} followers
              </span>
              <span className="text-xs text-gray-500">
                {user.followingCount} following
              </span>
            </div>
          </div>
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>

        <div className="mt-4">
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="text-center space-y-4">
        <div className="p-4 bg-white rounded-lg border-2 border-dashed border-purple-300">
          <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Farcaster</h3>
          <p className="text-gray-600 mb-4">
            Login with your Farcaster account to post your evolved content directly to Farcaster
          </p>
          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Login with Farcaster
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
} 