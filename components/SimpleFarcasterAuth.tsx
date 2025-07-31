'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '../hooks/use-toast';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
}

export default function SimpleFarcasterAuth() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsConnecting(true);
    try {
      // For now, we'll use a simple approach
      // In a real implementation, you'd integrate with Neynar's web SDK
      toast({
        title: "Farcaster Integration",
        description: "Farcaster authentication is being configured. Please check back soon!",
      });
      
      // Simulate connection for demo purposes
      setTimeout(() => {
        setUser({
          fid: 12345,
          username: 'demo_user',
          displayName: 'Demo User',
          pfp: 'https://picsum.photos/200'
        });
        setIsConnecting(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Farcaster",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Farcaster",
    });
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Connected to Farcaster</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardTitle>
          <CardDescription>
            You're signed in and ready to post content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.pfp} alt={user.displayName} />
              <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white">{user.displayName}</p>
              <p className="text-sm text-slate-400">@{user.username}</p>
              <p className="text-xs text-slate-500">FID: {user.fid}</p>
            </div>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full"
          >
            Disconnect Farcaster
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect to Farcaster</CardTitle>
        <CardDescription>
          Link your Farcaster account to save and post content directly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleSignIn}
          disabled={isConnecting}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Sign In with Farcaster
            </>
          )}
        </Button>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Powered by Neynar • Free to use
        </p>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Demo mode - Full integration coming soon!
        </p>
      </CardContent>
    </Card>
  );
} 