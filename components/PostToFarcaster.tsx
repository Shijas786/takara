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
  const { toast } = useToast();
  const [content, setContent] = useState(generatedContent || '');
  const [channelId, setChannelId] = useState('general');
  const [isPosting, setIsPosting] = useState(false);

  // Popular Farcaster channels
  const channels = [
    { id: 'general', name: 'No Channel (General)' },
    { id: 'memes', name: 'Memes' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'defi', name: 'DeFi' },
    { id: 'nfts', name: 'NFTs' },
    { id: 'trading', name: 'Trading' },
    { id: 'ai', name: 'AI' },
    { id: 'tech', name: 'Tech' },
  ];

  const handlePost = async () => {
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
      // Post the cast using the centralized posting functionality
      const postResponse = await fetch('/api/farcaster/publish-cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          channelId: channelId === 'general' ? undefined : channelId,
        }),
      });

      const postData = await postResponse.json();

      if (postData.success) {
        toast({
          title: "Posted to Farcaster! 🎉",
          description: "Your content has been successfully posted.",
        });
        
        // Clear the content
        setContent('');
        setChannelId('general');
        
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Post to Farcaster</CardTitle>
        <CardDescription>
          Share your evolved content directly to your Farcaster account
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
          Powered by Neynar
        </p>
      </CardContent>
    </Card>
  );
} 