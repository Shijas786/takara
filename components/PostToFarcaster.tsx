'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

interface PostToFarcasterProps {
  generatedContent?: string;
  onPostSuccess?: () => void;
}

export default function PostToFarcaster({ generatedContent, onPostSuccess }: PostToFarcasterProps) {
  // Local state for user and authentication
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { toast } = useToast();
  const [content, setContent] = useState(generatedContent || '');
  const [channelId, setChannelId] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Popular Farcaster channels
  const channels = [
    { id: '', name: 'No Channel (General)' },
    { id: 'memes', name: 'Memes' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'defi', name: 'DeFi' },
    { id: 'nfts', name: 'NFTs' },
    { id: 'trading', name: 'Trading' },
    { id: 'ai', name: 'AI' },
    { id: 'tech', name: 'Tech' },
  ];

  const handlePost = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Not Connected",
        description: "Please connect your Farcaster account first.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some content to post.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      // First, create a signer for the user if they don't have one
      const signerResponse = await fetch('/api/farcaster/create-signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid: user.fid,
        }),
      });

      const signerData = await signerResponse.json();

      if (!signerData.success) {
        throw new Error(signerData.error || 'Failed to create signer');
      }

      // Prepare cast data
      const castData: any = {
        text: content,
        signerUuid: signerData.signer.signer_uuid,
      };

      // Add channel if selected
      if (channelId) {
        castData.channelId = channelId;
      }

      // Post the cast
      const postResponse = await fetch('/api/farcaster/publish-cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(castData),
      });

      const postData = await postResponse.json();

      if (postData.success) {
        toast({
          title: "Posted to Farcaster! 🎉",
          description: "Your content has been successfully posted.",
        });
        
        // Clear the content
        setContent('');
        setChannelId('');
        
        // Call success callback
        onPostSuccess?.();
      } else {
        throw new Error(postData.error || 'Failed to post cast');
      }

    } catch (error: any) {
      console.error('Post error:', error);
      toast({
        title: "Post Failed",
        description: error.message || "Failed to post to Farcaster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Post to Farcaster</CardTitle>
          <CardDescription>
            Connect your Farcaster account to post content directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm">
            Please connect your Farcaster account above to enable posting.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Post to Farcaster</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </CardTitle>
        <CardDescription>
          Share your evolved content with the Farcaster community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Content to Post
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here..."
            className="min-h-[100px] bg-slate-700 border-slate-600 text-white"
            maxLength={320}
          />
          <p className="text-xs text-slate-500 mt-1">
            {content.length}/320 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Channel (Optional)
          </label>
          <Select value={channelId} onValueChange={setChannelId}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handlePost}
          disabled={isPosting || !content.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isPosting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Posting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Post to Farcaster
            </>
          )}
        </Button>

        <p className="text-xs text-slate-500 text-center">
          Posted as @{user?.username ?? 'unknown'} • Powered by Neynar
        </p>
      </CardContent>
    </Card>
  );
} 