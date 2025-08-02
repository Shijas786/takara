'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Repeat2, Share2, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { SafeImg } from './ui/image';
import ClientOnlyWrapper from './ClientOnlyWrapper';
import { farcasterAPI, neynarAPI, farcasterUtils, type FarcasterCast, type FarcasterUser } from '../lib/farcaster';

interface FarcasterFeedProps {
  user: FarcasterUser | null;
  signerUuid?: string;
}

export default function FarcasterFeed({ user, signerUuid }: FarcasterFeedProps) {
  const [casts, setCasts] = useState<FarcasterCast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'user'>('trending');
  const { toast } = useToast();

  const loadCasts = useCallback(async () => {
    setIsLoading(true);
    try {
      let newCasts: FarcasterCast[] = [];
      
      if (activeTab === 'trending') {
        newCasts = await neynarAPI.getTrendingCasts(20);
      } else if (activeTab === 'user' && user?.fid) {
        newCasts = await neynarAPI.getUserCasts(user.fid, 20);
      }
      
      setCasts(newCasts);
    } catch (error) {
      console.error('Load casts error:', error);
      toast({
        title: "Failed to Load Casts",
        description: "Unable to load Farcaster casts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, user?.fid, toast]);

  // Load casts on mount and when tab changes
  useEffect(() => {
    loadCasts();
  }, [loadCasts]);

  const refreshCasts = async () => {
    setIsRefreshing(true);
    await loadCasts();
    setIsRefreshing(false);
    toast({
      title: "Feed Refreshed",
      description: "Latest casts have been loaded",
    });
  };

  const handleLike = async (cast: FarcasterCast) => {
    if (!signerUuid) {
      toast({
        title: "Not Connected",
        description: "Please connect your Farcaster account to like casts",
        variant: "destructive",
      });
      return;
    }

    try {
      await farcasterAPI.likeCast(signerUuid, cast.hash);
      toast({
        title: "Cast Liked",
        description: "You liked this cast",
      });
    } catch (error) {
      console.error('Like cast error:', error);
      toast({
        title: "Failed to Like",
        description: "Unable to like this cast. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRecast = async (cast: FarcasterCast) => {
    if (!signerUuid) {
      toast({
        title: "Not Connected",
        description: "Please connect your Farcaster account to recast",
        variant: "destructive",
      });
      return;
    }

    try {
      await farcasterAPI.recastCast(signerUuid, cast.hash);
      toast({
        title: "Cast Recasted",
        description: "You recast this cast",
      });
    } catch (error) {
      console.error('Recast error:', error);
      toast({
        title: "Failed to Recast",
        description: "Unable to recast this cast. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (cast: FarcasterCast) => {
    if (!signerUuid) {
      toast({
        title: "Not Connected",
        description: "Please connect your Farcaster account to reply",
        variant: "destructive",
      });
      return;
    }

    // This would typically open a reply modal
    toast({
      title: "Reply Feature",
      description: "Reply functionality coming soon!",
    });
  };

  const handleShare = async (cast: FarcasterCast) => {
    const castUrl = `https://warpcast.com/${cast.author.username}/${cast.hash}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cast by @${cast.author.username}`,
          text: cast.text,
          url: castUrl,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(castUrl);
        toast({
          title: "Link Copied",
          description: "Cast link copied to clipboard",
        });
      } catch (error) {
        console.error('Copy error:', error);
        toast({
          title: "Failed to Copy",
          description: "Unable to copy cast link",
          variant: "destructive",
        });
      }
    }
  };

  const formatText = (text: string) => {
    // Convert mentions to links
    let formattedText = text.replace(/@(\w+)/g, '<span class="text-blue-400">@$1</span>');
    
    // Convert hashtags to links
    formattedText = formattedText.replace(/#(\w+)/g, '<span class="text-purple-400">#$1</span>');
    
    // Convert URLs to links
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    );
    
    return formattedText;
  };

  const CastCard = ({ cast }: { cast: FarcasterCast }) => (
    <Card className="p-4 bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600">
            <SafeImg 
              src={cast.author.pfp || 'https://placehold.co/150x150'} 
              alt={cast.author.displayName}
              className="w-full h-full"
              width={40}
              height={40}
              fallbackSrc="https://placehold.co/150x150"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-white font-medium">{cast.author.displayName}</span>
            <span className="text-slate-400">@{cast.author.username}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-500 text-sm">
              {farcasterUtils.formatTimestamp(cast.timestamp)}
            </span>
          </div>
          
          <div className="text-white mb-3">
            <div 
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: formatText(cast.text) }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReply(cast)}
                className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">{cast.reactions.replies}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRecast(cast)}
                className="text-slate-400 hover:text-green-400 hover:bg-green-400/10"
              >
                <Repeat2 className="w-4 h-4 mr-1" />
                <span className="text-xs">{cast.reactions.recasts}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(cast)}
                className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
              >
                <Heart className="w-4 h-4 mr-1" />
                <span className="text-xs">{cast.reactions.likes}</span>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(cast)}
              className="text-slate-400 hover:text-slate-300 hover:bg-slate-600"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <ClientOnlyWrapper
      fallback={
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Loading Farcaster Feed...</h3>
          </div>
        </Card>
      }
    >
      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Farcaster Feed</h3>
          <Button
            onClick={refreshCasts}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button
            onClick={() => setActiveTab('trending')}
            variant={activeTab === 'trending' ? 'default' : 'outline'}
            size="sm"
            className={activeTab === 'trending' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300'}
          >
            Trending
          </Button>
          <Button
            onClick={() => setActiveTab('user')}
            variant={activeTab === 'user' ? 'default' : 'outline'}
            size="sm"
            disabled={!user}
            className={activeTab === 'user' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300'}
          >
            Your Casts
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">Loading casts...</p>
          </div>
        ) : casts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">
              {activeTab === 'trending' 
                ? 'No trending casts available' 
                : 'No casts found for this user'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {casts.map((cast) => (
              <CastCard key={cast.hash} cast={cast} />
            ))}
          </div>
        )}

        {!user && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              💡 Connect your Farcaster account to like, recast, and reply to casts!
            </p>
          </div>
        )}
      </Card>
    </ClientOnlyWrapper>
  );
} 