'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Loader2, CheckCircle, XCircle, Send, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

interface Cast {
  hash: string;
  text: string;
  timestamp: string;
  author: {
    username: string;
    displayName: string;
    pfp: string;
  };
}

export default function FarcasterConnect() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [fid, setFid] = useState('');
  const [castText, setCastText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoadingCasts, setIsLoadingCasts] = useState(false);

  const connectUser = async () => {
    if (!fid.trim()) {
      alert('Please enter a FID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/farcaster/user?fid=${fid}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsConnected(true);
        fetchCasts(fid);
      } else {
        alert(data.error || 'Failed to connect user');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect to Farcaster');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCasts = async (userFid: string) => {
    setIsLoadingCasts(true);
    try {
      const response = await fetch(`/api/farcaster/casts?fid=${userFid}`);
      const data = await response.json();

      if (data.success) {
        setCasts(data.casts);
      } else {
        console.error('Failed to fetch casts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching casts:', error);
    } finally {
      setIsLoadingCasts(false);
    }
  };

  const postCast = async () => {
    if (!castText.trim() || !user) {
      alert('Please enter cast text and connect a user first');
      return;
    }

    setIsPosting(true);
    try {
      const response = await fetch('/api/farcaster/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid: user.fid,
          text: castText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCastText('');
        alert('Cast posted successfully!');
        // Refresh casts
        fetchCasts(user.fid.toString());
      } else {
        alert(data.error || 'Failed to post cast');
      }
    } catch (error) {
      console.error('Post error:', error);
      alert('Failed to post cast');
    } finally {
      setIsPosting(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    setCasts([]);
    setIsConnected(false);
    setFid('');
    setCastText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img 
            src="https://freeimage.host/i/FS6Q5zb" 
            alt="Logo" 
            className="w-12 h-12 rounded-lg"
          />
          <h1 className="text-3xl font-bold text-gray-900">Farcaster Connect</h1>
        </div>
        <p className="text-gray-600">Connect your Farcaster account and manage your casts</p>
      </div>

      {/* Connection Section */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Connect Farcaster Account</h2>
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Farcaster ID (FID)
              </label>
              <Input
                type="text"
                placeholder="e.g., 259913"
                value={fid}
                onChange={(e) => setFid(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Farcaster ID to connect and post casts
              </p>
            </div>
            <Button 
              onClick={connectUser}
              disabled={isLoading || !fid.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-green-200">
              <img 
                src={user?.pfp} 
                alt={user?.displayName}
                className="w-12 h-12 rounded-full border-2 border-green-300"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{user?.displayName}</h3>
                <p className="text-sm text-gray-600">@{user?.username} (FID: {user?.fid})</p>
                <div className="flex space-x-4 mt-1">
                  <span className="text-xs text-gray-500">
                    {user?.followerCount} followers
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.followingCount} following
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>

            {/* Post Cast */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Post a Cast
              </label>
              <Textarea
                placeholder="What's on your mind?"
                value={castText}
                onChange={(e) => setCastText(e.target.value)}
                className="w-full h-24 resize-none"
                maxLength={320}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {castText.length}/320 characters
                </span>
                <Button 
                  onClick={postCast}
                  disabled={isPosting || !castText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Cast
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={disconnect}
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              Disconnect
            </Button>
          </div>
        )}
      </Card>

      {/* Casts Section */}
      {isConnected && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Latest Casts</h2>
            </div>
            <Button 
              onClick={() => fetchCasts(user!.fid.toString())}
              disabled={isLoadingCasts}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingCasts ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isLoadingCasts ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600 mt-2">Loading casts...</p>
            </div>
          ) : casts.length > 0 ? (
            <div className="space-y-4">
              {casts.map((cast) => (
                <div key={cast.hash} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={cast.author.pfp} 
                      alt={cast.author.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{cast.author.displayName}</span>
                        <span className="text-sm text-gray-500">@{cast.author.username}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(cast.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{cast.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No casts found</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
} 