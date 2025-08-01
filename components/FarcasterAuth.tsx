'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import dynamic from 'next/dynamic';

// Proper dynamic import for NeynarAuthButton
const NeynarAuthButton = dynamic(
  () => import('@neynar/react').then((mod) => ({ default: mod.NeynarAuthButton })),
  { ssr: false, loading: () => <div className="h-10 bg-slate-700 rounded animate-pulse"></div> }
);

export default function FarcasterAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [neynarModule, setNeynarModule] = useState<any>(null);

  useEffect(() => {
    // Load Neynar module on client side
    import('@neynar/react').then((mod) => {
      setNeynarModule(mod);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Failed to load Neynar module:', err);
      setIsLoading(false);
    });
  }, []);

  // Use Neynar context if available
  let neynarContext = { user: null, isAuthenticated: false };
  let SIWN_variant = null;
  
  try {
    if (neynarModule?.useNeynarContext) {
      neynarContext = neynarModule.useNeynarContext();
    }
    SIWN_variant = neynarModule?.SIWN_variant;
  } catch (err) {
    console.error('Error using Neynar context:', err);
  }

  const currentUser = neynarContext?.user || user;
  const currentIsAuthenticated = neynarContext?.isAuthenticated || isAuthenticated;

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (currentIsAuthenticated && currentUser) {
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
              <AvatarImage src={currentUser.pfp_url} alt={currentUser.display_name} />
              <AvatarFallback>{currentUser.display_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white">{currentUser.display_name}</p>
              <p className="text-sm text-slate-400">@{currentUser.username}</p>
              <p className="text-xs text-slate-500">FID: {currentUser.fid}</p>
            </div>
          </div>
          {NeynarAuthButton && SIWN_variant && (
            <NeynarAuthButton 
              variant={SIWN_variant.FARCASTER}
              className="w-full"
            />
          )}
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
        {NeynarAuthButton && SIWN_variant ? (
          <NeynarAuthButton 
            variant={SIWN_variant.FARCASTER}
            className="w-full bg-purple-600 hover:bg-purple-700"
          />
        ) : (
          <div className="h-10 bg-slate-700 rounded animate-pulse"></div>
        )}
        <p className="text-xs text-slate-500 mt-2 text-center">
          Powered by Neynar • Free to use
        </p>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Opens in a new window to connect your Farcaster account
        </p>
      </CardContent>
    </Card>
  );
} 