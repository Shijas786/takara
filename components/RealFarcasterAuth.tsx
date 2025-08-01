'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { User, MessageCircle, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { SafeImg } from './ui/image';

interface FarcasterUser {
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

interface RealFarcasterAuthProps {
  onUserChange: (user: FarcasterUser | null) => void;
}

// Client-only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Loading...</h3>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}

export default function RealFarcasterAuth({ onUserChange }: RealFarcasterAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('takara_farcaster_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFarcasterUser(user);
      onUserChange(user);
    }
  }, [onUserChange]);

  const handleSignIn = async () => {
    setIsConnecting(true);
    try {
      // For now, just show a message that Farcaster integration is coming soon
      toast({
        title: "Farcaster Integration",
        description: "Farcaster integration is coming soon! For now, you can use the content generation features.",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: "Failed to connect to Farcaster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setFarcasterUser(null);
      localStorage.removeItem('takara_farcaster_user');
      onUserChange(null);

      toast({
        title: "Signed Out",
        description: "You have been disconnected from Farcaster.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ClientOnly>
      {!farcasterUser ? (
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Connect to Farcaster</h3>
            <p className="text-slate-300 mb-4">
              Sign in with your Farcaster account to post content directly
            </p>
            <Button
              onClick={handleSignIn}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isConnecting ? (
                <>
                  <User className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Sign in with Farcaster
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 flex items-center justify-center">
                <SafeImg 
                  src={farcasterUser.pfp || 'https://placehold.co/150x150'} 
                  alt={farcasterUser.displayName}
                  className="w-full h-full"
                  width={40}
                  height={40}
                  fallbackSrc="https://placehold.co/150x150"
                />
              </div>
              <div>
                <p className="text-white font-medium">@{farcasterUser.username}</p>
                <p className="text-slate-400 text-sm">{farcasterUser.displayName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                  <span className="text-slate-400 text-xs">
                    FID: {farcasterUser.fid}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-400 hover:bg-red-900"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </Card>
      )}
    </ClientOnly>
  );
} 