'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NeynarAuthButton, useNeynarContext, SIWN_variant } from '@neynar/react';

export default function FarcasterAuth() {
  const { user } = useNeynarContext();
  const [error, setError] = useState<string | null>(null);

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
              <AvatarImage src={user.pfp_url} alt={user.display_name} />
              <AvatarFallback>{user.display_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white">{user.display_name}</p>
              <p className="text-sm text-slate-400">@{user.username}</p>
              <p className="text-xs text-slate-500">FID: {user.fid}</p>
            </div>
          </div>
          <NeynarAuthButton 
            variant={SIWN_variant.FARCASTER}
            className="w-full"
          />
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
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <NeynarAuthButton 
          variant={SIWN_variant.FARCASTER}
          className="w-full bg-purple-600 hover:bg-purple-700"
        />
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