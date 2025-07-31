'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Save, MessageCircle, Clock, Trash2, CheckCircle, User, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import SimplePostToFarcaster from './SimplePostToFarcaster';

// import { useMiniApp } from '@neynar/react';

interface Draft {
  id: string;
  content: string;
  prompt: string;
  timestamp: number;
}

interface ScheduledPost {
  id: string;
  content: string;
  scheduledTime: string;
  timeSlot: string;
  isPosted: boolean;
}

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
}

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [evolutionStyle, setEvolutionStyle] = useState('based');
  const [evolutionLength, setEvolutionLength] = useState('medium');
  const [evolutionTone, setEvolutionTone] = useState('authentic');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  // const { isSDKLoaded, context } = useMiniApp();

  // Load drafts, scheduled posts, and user data from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('takara_drafts');
    const savedScheduled = localStorage.getItem('takara_scheduled_posts');
    const savedUser = localStorage.getItem('takara_farcaster_user');

    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
    if (savedScheduled) {
      setScheduledPosts(JSON.parse(savedScheduled));
    }
    if (savedUser) {
      setFarcasterUser(JSON.parse(savedUser));
    }
  }, []);

  // Auto-connect if we have Farcaster context
  // useEffect(() => {
  //   if (isSDKLoaded && context && !farcasterUser) {
  //     connectFarcasterWallet();
  //   }
  // }, [isSDKLoaded, context, farcasterUser]);

  const connectFarcasterWallet = async () => {
    setIsConnecting(true);
    try {
      // For now, just show a message to connect wallet manually
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet in Farcaster/Warpcast first",
      });
      
      // Fallback: Open Warpcast for connection
      window.open('https://warpcast.com/~/developers/frames', '_blank');
    } catch (error) {
      console.error('Connect wallet error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setFarcasterUser(null);
    localStorage.removeItem('takara_farcaster_user');
    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: evolutionStyle,
          length: evolutionLength,
          tone: evolutionTone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
        toast({
          title: "Content Generated!",
          description: "Your evolved content is ready",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: data.error || "Failed to generate content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Generate content first to copy",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const downloadContent = () => {
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Generate content first to download",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
          a.download = `takara-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Content saved to your device",
    });
  };

  const saveDraft = () => {
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Generate content first to save",
        variant: "destructive",
      });
      return;
    }

    const newDraft: Draft = {
      id: Date.now().toString(),
      content: generatedContent,
      prompt: prompt,
      timestamp: Date.now(),
    };

    const updatedDrafts = [newDraft, ...drafts];
    setDrafts(updatedDrafts);
    localStorage.setItem('takara_drafts', JSON.stringify(updatedDrafts));

    toast({
      title: "Draft Saved!",
      description: "Content saved to your drafts",
    });
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('takara_drafts', JSON.stringify(updatedDrafts));
  };

  const schedulePost = (content: string) => {
    const timeSlots = [
      '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'
    ];
    const randomSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(parseInt(randomSlot.split(':')[0]), parseInt(randomSlot.split(' ')[0].split(':')[1]), 0, 0);

    const newScheduledPost: ScheduledPost = {
      id: Date.now().toString(),
      content: content,
      scheduledTime: tomorrow.toISOString(),
      timeSlot: randomSlot,
      isPosted: false,
    };

    const updatedScheduled = [newScheduledPost, ...scheduledPosts];
    setScheduledPosts(updatedScheduled);
    localStorage.setItem('takara_scheduled_posts', JSON.stringify(updatedScheduled));

    toast({
      title: "Post Scheduled!",
      description: `Scheduled for tomorrow at ${randomSlot}`,
    });
  };

  const postToFarcaster = async () => {
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Generate content first to post",
        variant: "destructive",
      });
      return;
    }

    if (!farcasterUser) {
      toast({
        title: "Not Connected",
        description: "Please connect your Farcaster account first",
        variant: "destructive",
      });
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
          text: generatedContent,
          fid: farcasterUser.fid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Posted to Farcaster!",
          description: `Your evolved content is now live on @${farcasterUser.username}`,
        });
      } else {
        toast({
          title: "Post Failed",
          description: data.error || "Failed to post to Farcaster",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Post error:', error);
      toast({
        title: "Post Error",
        description: "Failed to post to Farcaster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Content Takara Evolution</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Paste your idea, thought, or reply — and let Takara rework it using real styles from top crypto influencers. Whether it's a sharp quote, spicy reply, or a viral CTA, Takara evolves your words for maximum impact.
        </p>
      </div>



      {/* Farcaster Connection */}
      <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Wallet className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Connect Your Farcaster Account</h2>
        </div>
        
        {!farcasterUser ? (
          <div className="space-y-4">
            <p className="text-slate-300">
              Connect your Farcaster wallet to post content directly to your account.
            </p>
            <Button 
              onClick={connectFarcasterWallet}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isConnecting ? (
                <>
                  <Wallet className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Farcaster Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {farcasterUser.pfp && (
                  <img 
                    src={farcasterUser.pfp} 
                    alt={farcasterUser.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-white font-semibold">
                    @{farcasterUser.username}
                  </p>
                  <p className="text-slate-400 text-sm">
                    FID: {farcasterUser.fid} • {farcasterUser.followerCount} followers
                  </p>
                </div>
              </div>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Disconnect
              </Button>
            </div>
            <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg">
              <p className="text-green-400 text-sm">
                ✅ Connected to Farcaster! You can now post content to your account.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Input */}
      <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Your Content</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter your content to evolve
            </label>
            <Textarea
              placeholder="Paste your idea, thought, or reply here... (Takara will evolve it for maximum impact)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 resize-none bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Evolution Style</label>
              <Select value={evolutionStyle} onValueChange={setEvolutionStyle}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="based">Based</SelectItem>
                  <SelectItem value="influencer">Influencer Style</SelectItem>
                  <SelectItem value="reply-guy">Reply Guy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Evolution Length</label>
              <Select value={evolutionLength} onValueChange={setEvolutionLength}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="short">Short & Punchy</SelectItem>
                  <SelectItem value="medium">Medium & Balanced</SelectItem>
                  <SelectItem value="long">Long & Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Evolution Tone</label>
              <Select value={evolutionTone} onValueChange={setEvolutionTone}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="authentic">Authentic & Real</SelectItem>
                  <SelectItem value="confident">Confident & Bold</SelectItem>
                  <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                  <SelectItem value="authoritative">Authoritative & Expert</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={generateContent}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Takara Evolution
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Takara Evolution
                </>
              )}
            </Button>
            <Button 
              onClick={() => setPrompt('')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Evolved Content</h3>
            <div className="flex space-x-2">
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                onClick={downloadContent}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                onClick={saveDraft}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Draft
              </Button>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 mb-4">
            <p className="text-white whitespace-pre-wrap">{generatedContent}</p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={postToFarcaster}
              disabled={isPosting || !farcasterUser}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPosting ? (
                <>
                  <MessageCircle className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Post to Your Farcaster
                </>
              )}
            </Button>
            <Button
              onClick={() => schedulePost(generatedContent)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>
      )}

      {/* Drafts */}
      {drafts.length > 0 && (
        <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Your Drafts</h3>
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-white text-sm truncate">{draft.content}</p>
                  <p className="text-slate-400 text-xs">
                    {new Date(draft.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => deleteDraft(draft.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Posts */}
      {scheduledPosts.length > 0 && (
        <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Scheduled Posts</h3>
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-white text-sm truncate">{post.content}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-xs">
                      {post.timeSlot} - {new Date(post.scheduledTime).toLocaleDateString()}
                    </span>
                    {post.isPosted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Posted
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 