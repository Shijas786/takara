'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, LogOut, MessageCircle, Send } from 'lucide-react';
import { useMiniApp } from '@neynar/react';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
}

export default function NeynarMiniAppAuth() {
  const miniApp = useMiniApp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');

  const handleLogin = async () => {
    setIsConnecting(true);
    try {
      // MiniApp authentication is handled automatically when the app is opened in Farcaster
      // We just need to wait for the context to be available
      await miniApp.actions.ready();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      // MiniApp logout is handled by closing the app
      await miniApp.actions.close();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    
    setIsPosting(true);
    try {
      const result = await miniApp.actions.composeCast({
        text: postText,
        close: false,
      });

      if (result.cast) {
        console.log('Cast posted successfully:', result);
        setPostText('');
        // You could add a success toast here
      } else {
        console.error('Failed to post cast');
      }
    } catch (error) {
      console.error('Error posting cast:', error);
    } finally {
      setIsPosting(false);
    }
  };

  if (miniApp.context?.user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Connected to Farcaster</span>
            <Badge variant="secondary" className="ml-auto">Connected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              {miniApp.context.user.pfpUrl ? (
                <img 
                  src={miniApp.context.user.pfpUrl} 
                  alt={miniApp.context.user.displayName || miniApp.context.user.username} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{miniApp.context.user.displayName || miniApp.context.user.username}</p>
              <p className="text-sm text-gray-500">@{miniApp.context.user.username}</p>
              <p className="text-xs text-gray-400">FID: {miniApp.context.user.fid}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </div>

          {/* Post Cast Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Post to Farcaster</h4>
            <div className="space-y-2">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                maxLength={320}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {postText.length}/320 characters
                </span>
                <Button 
                  onClick={handlePost} 
                  disabled={!postText.trim() || isPosting}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isPosting ? 'Posting...' : 'Post Cast'}
                </Button>
              </div>
            </div>
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
          Connect your Farcaster account using Neynar Mini App authentication to generate and post content directly to your profile.
        </p>
        <Button 
          onClick={handleLogin} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect with Neynar'}
        </Button>
      </CardContent>
    </Card>
  );
} 