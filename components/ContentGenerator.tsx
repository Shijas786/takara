'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Save, MessageCircle, Clock, Trash2, CheckCircle, User, Wallet, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import sdk from '@farcaster/miniapp-sdk';

import ClientOnlyWrapper from './ClientOnlyWrapper';


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

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [evolutionStyle, setEvolutionStyle] = useState('based');
  const [evolutionLength, setEvolutionLength] = useState('medium');
  const [evolutionTone, setEvolutionTone] = useState('authentic');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<any>(null);

  // Check if we're in a Mini App context
  const [isMiniAppAvailable, setIsMiniAppAvailable] = useState(false);
  const [miniAppUser, setMiniAppUser] = useState<any>(null);
  const { toast } = useToast();



  // Load drafts and scheduled posts from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('takara_drafts');
    const savedScheduled = localStorage.getItem('takara_scheduled_posts');

    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
    if (savedScheduled) {
      setScheduledPosts(JSON.parse(savedScheduled));
    }
  }, []);

  // Check Farcaster connection status
  useEffect(() => {
    const checkMiniAppContext = async () => {
      try {
        console.log('Checking Mini App context...');
        
        // Always try to call ready() - this is the standard way to initialize
        await sdk.actions.ready();
        console.log('SDK ready() called successfully');
        setIsMiniAppAvailable(true);
        
        // Get the user context
        const context = await sdk.context;
        console.log('SDK context:', context);
        
        if (context?.user) {
          setMiniAppUser(context.user);
          setIsFarcasterConnected(true);
          setFarcasterUser(context.user);
          console.log('User authenticated:', context.user);
        } else {
          console.log('No user in context, but SDK is available');
          setIsFarcasterConnected(false);
          setFarcasterUser(null);
        }
      } catch (error) {
        console.error('Error initializing Farcaster SDK:', error);
        // Even if ready() fails, we might still be in a Mini App
        setIsMiniAppAvailable(true);
        setIsFarcasterConnected(false);
        setFarcasterUser(null);
      }
    };

    checkMiniAppContext();
  }, []);

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
          description: "Your content has been evolved by Takara",
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
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const downloadContent = () => {
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
      description: "Content downloaded successfully",
    });
  };

  const saveDraft = () => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      content: generatedContent,
      prompt: prompt,
      timestamp: Date.now(),
    };

    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    localStorage.setItem('takara_drafts', JSON.stringify(updatedDrafts));

    toast({
      title: "Draft Saved!",
      description: "Your content has been saved as a draft",
    });
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('takara_drafts', JSON.stringify(updatedDrafts));
  };

  const schedulePost = (content: string) => {
    const timeSlots = ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
    const randomSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    const scheduledTime = new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString();

    const newScheduledPost: ScheduledPost = {
      id: Date.now().toString(),
      content: content,
      scheduledTime: scheduledTime,
      timeSlot: randomSlot,
      isPosted: false,
    };

    const updatedScheduledPosts = [...scheduledPosts, newScheduledPost];
    setScheduledPosts(updatedScheduledPosts);
    localStorage.setItem('takara_scheduled_posts', JSON.stringify(updatedScheduledPosts));

    toast({
      title: "Post Scheduled!",
      description: `Your post has been scheduled for ${randomSlot}`,
    });
  };

  const postToFarcaster = async () => {
    if (!generatedContent.trim()) {
      toast({
        title: "No Content",
        description: "Please generate content first",
        variant: "destructive",
      });
      return;
    }

    if (!isMiniAppAvailable) {
      toast({
        title: "Not Connected",
        description: "Please open this app in Farcaster to post",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    try {
      console.log('Posting to Farcaster:', generatedContent.substring(0, 100) + '...');
      
      // Use the Farcaster MiniApp SDK composeCast action
      const result = await sdk.actions.composeCast({
        text: generatedContent,
        close: false, // Keep the mini app open after posting
      });

      if (result?.cast) {
        toast({
          title: "Posted to Farcaster!",
          description: "Your evolved content has been posted successfully",
        });
        console.log('Cast posted successfully:', result);
      } else {
        toast({
          title: "Post Failed",
          description: "Failed to post to Farcaster",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error posting to Farcaster:', error);
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
    <ClientOnlyWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Content Takara Evolution</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Paste your idea, thought, or reply — and let Takara rework it using real styles from top crypto influencers. Whether it&apos;s a sharp quote, spicy reply, or a viral CTA, Takara evolves your words for maximum impact.
          </p>
        </div>

        {/* Debug Status */}
        <div className="rounded-xl border text-card-foreground shadow p-4 bg-slate-900 border-slate-600">
          <div className="flex items-center space-x-3 mb-3">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Farcaster Status</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">SDK Available:</span>
              <span className={`ml-2 ${!!sdk ? 'text-green-400' : 'text-red-400'}`}>
                {!!sdk ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Mini App:</span>
              <span className={`ml-2 ${isMiniAppAvailable ? 'text-green-400' : 'text-red-400'}`}>
                {isMiniAppAvailable ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Connected:</span>
              <span className={`ml-2 ${isFarcasterConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isFarcasterConnected ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">User:</span>
              <span className={`ml-2 ${farcasterUser ? 'text-green-400' : 'text-red-400'}`}>
                {farcasterUser ? `✅ ${farcasterUser.username || farcasterUser.fid || 'Unknown'}` : '❌ None'}
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            <span>User Agent: {navigator.userAgent.substring(0, 50)}...</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button 
              onClick={async () => {
                try {
                  console.log('Testing SDK ready...');
                  await sdk.actions.ready();
                  console.log('SDK ready test successful');
                  toast({
                    title: "SDK Test",
                    description: "SDK ready() test successful!",
                  });
                } catch (error) {
                  console.error('SDK ready test failed:', error);
                  toast({
                    title: "SDK Test Failed",
                    description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    variant: "destructive",
                  });
                }
              }}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Test SDK Ready
            </Button>
            <Button 
              onClick={async () => {
                try {
                  console.log('Testing SDK context...');
                  const context = await sdk.context;
                  console.log('SDK context test successful:', context);
                  toast({
                    title: "Context Test",
                    description: `Context: ${JSON.stringify(context, null, 2)}`,
                  });
                } catch (error) {
                  console.error('SDK context test failed:', error);
                  toast({
                    title: "Context Test Failed",
                    description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    variant: "destructive",
                  });
                }
              }}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Test SDK Context
            </Button>
          </div>
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

        {/* Farcaster Connection Status */}
        <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Farcaster Connection</h3>
                <p className="text-sm text-slate-400">
                  {isFarcasterConnected 
                    ? `Connected as @${farcasterUser?.username || 'User'}`
                    : 'Not connected to Farcaster'
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={isFarcasterConnected ? "default" : "secondary"}
              className={isFarcasterConnected 
                ? "bg-green-100 text-green-800" 
                : "bg-slate-100 text-slate-800"
              }
            >
              {isFarcasterConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          {!isFarcasterConnected && (
            <div className="mt-4 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300 mb-2">
                To post content to Farcaster, you need to connect your wallet or use the Farcaster app.
              </p>
              <p className="text-xs text-slate-400">
                Open this app in Farcaster or connect your wallet to enable posting.
              </p>
            </div>
          )}
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
                onClick={() => schedulePost(generatedContent)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule Post
              </Button>
              <Button
                onClick={postToFarcaster}
                disabled={isPosting || !isFarcasterConnected || !generatedContent.trim()}
                variant="outline"
                className={`${
                  isFarcasterConnected 
                    ? 'border-purple-600 text-purple-300 hover:bg-purple-700' 
                    : 'border-slate-500 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                {isPosting ? 'Posting...' : 
                 !isFarcasterConnected ? 'Connect to Post' : 
                 'Post to Farcaster'}
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
    </ClientOnlyWrapper>
  );
} 