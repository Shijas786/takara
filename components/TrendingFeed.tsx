'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, MessageCircle, Heart, Repeat, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface Cast {
  hash: string;
  text: string;
  timestamp: string;
  author: {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
  };
  reactions: {
    likes: number;
    recasts: number;
    replies: number;
  };
}

export default function TrendingFeed() {
  const [trendingCasts, setTrendingCasts] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const fetchTrendingFeed = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/farcaster/trending-feed?limit=5');
      const data = await response.json();

      if (data.success) {
        setTrendingCasts(data.feed);
      } else {
        toast({
          title: "Failed to fetch trending feed",
          description: data.error || "Could not load trending content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching trending feed:', error);
      toast({
        title: "Error",
        description: "Failed to load trending content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingFeed();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleCastClick = (cast: Cast) => {
    // Copy cast text to clipboard for inspiration
    navigator.clipboard.writeText(cast.text);
    toast({
      title: "Cast copied!",
      description: "Use this as inspiration for your content",
    });
  };

  if (trendingCasts.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Trending on Farcaster</h3>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {trendingCasts.slice(0, isExpanded ? trendingCasts.length : 3).map((cast) => (
            <div
              key={cast.hash}
              onClick={() => handleCastClick(cast)}
              className="p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {cast.author.pfp_url && (
                  <img
                    src={cast.author.pfp_url}
                    alt={cast.author.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium text-sm">
                      {cast.author.display_name}
                    </span>
                    <span className="text-slate-400 text-sm">
                      @{cast.author.username}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {formatTimestamp(cast.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                    {cast.text}
                  </p>
                  <div className="flex items-center space-x-4 text-slate-400 text-xs">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{cast.reactions.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Repeat className="w-3 h-3" />
                      <span>{cast.reactions.recasts}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{cast.reactions.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-600">
        <Button
          onClick={fetchTrendingFeed}
          variant="outline"
          size="sm"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Refresh Trending
        </Button>
      </div>
    </Card>
  );
} 