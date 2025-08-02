'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, LogOut, MessageCircle } from 'lucide-react';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
}

export default function FarcasterConnect() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if user is already connected
    const token = localStorage.getItem('takara_farcaster_token');
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://api.farcaster.xyz/v2/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token might be expired, remove it
        localStorage.removeItem('takara_farcaster_token');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const connectToFarcaster = () => {
    setIsConnecting(true);
    
    const clientId = process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID;
    const redirectUri = `${window.location.origin}/farcaster-callback`;
    const scope = 'user:read,cast:read,cast:write';
    
    const authUrl = `https://api.farcaster.xyz/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
    
    window.location.href = authUrl;
  };

  const disconnect = () => {
    localStorage.removeItem('takara_farcaster_token');
    setUser(null);
  };

  if (user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Connected to Farcaster</span>
            <Badge variant="secondary" className="ml-auto">Connected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect}>
              <LogOut className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Connect to Farcaster</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Connect your Farcaster account to generate and post content directly to your profile.
        </p>
        <Button 
          onClick={connectToFarcaster} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect Farcaster Account'}
        </Button>
      </CardContent>
    </Card>
  );
} 