'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Save, MessageCircle, Clock, Trash2, CheckCircle, User, Link } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

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

interface UserSigner {
  signer_uuid: string;
  status: string;
  fid?: number;
  signer_approval_url?: string;
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
  const [userSigner, setUserSigner] = useState<UserSigner | null>(null);
  const [isCreatingSigner, setIsCreatingSigner] = useState(false);
  const [isCheckingSigner, setIsCheckingSigner] = useState(false);
  const { toast } = useToast();

  // Load drafts, scheduled posts, and user signer from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('kai_drafts');
    const savedScheduled = localStorage.getItem('kai_scheduled_posts');
    const savedSigner = localStorage.getItem('kai_user_signer');

    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
    if (savedScheduled) {
      setScheduledPosts(JSON.parse(savedScheduled));
    }
    if (savedSigner) {
      setUserSigner(JSON.parse(savedSigner));
    }
  }, []);

  const createUserSigner = async () => {
    setIsCreatingSigner(true);
    try {
      const response = await fetch('/api/farcaster/create-signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const newSigner = data.signer;
        setUserSigner(newSigner);
        localStorage.setItem('kai_user_signer', JSON.stringify(newSigner));
        
        toast({
          title: "Signer Created!",
          description: "Please approve your signer using the link below",
        });

        // Open approval URL in new tab
        if (newSigner.signer_approval_url) {
          window.open(newSigner.signer_approval_url, '_blank');
        }
      } else {
        toast({
          title: "Signer Creation Failed",
          description: data.error || "Failed to create signer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Create signer error:', error);
      toast({
        title: "Signer Creation Error",
        description: "Failed to create signer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSigner(false);
    }
  };

  const checkSignerStatus = async () => {
    if (!userSigner?.signer_uuid) return;

    setIsCheckingSigner(true);
    try {
      const response = await fetch('/api/farcaster/check-signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: userSigner.signer_uuid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedSigner = data.signer;
        setUserSigner(updatedSigner);
        localStorage.setItem('kai_user_signer', JSON.stringify(updatedSigner));

        if (data.approved) {
          toast({
            title: "Signer Approved!",
            description: "You can now post to your Farcaster account",
          });
        } else {
          toast({
            title: "Signer Status",
            description: data.message,
          });
        }
      } else {
        toast({
          title: "Status Check Failed",
          description: data.error || "Failed to check signer status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Check signer error:', error);
      toast({
        title: "Status Check Error",
        description: "Failed to check signer status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSigner(false);
    }
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
    a.download = `kai-content-${Date.now()}.txt`;
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
    localStorage.setItem('kai_drafts', JSON.stringify(updatedDrafts));

    toast({
      title: "Draft Saved!",
      description: "Content saved to your drafts",
    });
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('kai_drafts', JSON.stringify(updatedDrafts));
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
    localStorage.setItem('kai_scheduled_posts', JSON.stringify(updatedScheduled));

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

    if (!userSigner || userSigner.status !== 'approved') {
      toast({
        title: "Signer Not Ready",
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
          signer_uuid: userSigner.signer_uuid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Posted to Farcaster!",
          description: "Your evolved content is now live on your account",
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
        <h2 className="text-2xl font-bold text-white mb-4">Content Kai Evolution</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Paste your idea, thought, or reply — and let Kai rework it using real styles from top crypto influencers. Whether it's a sharp quote, spicy reply, or a viral CTA, Kai evolves your words for maximum impact.
        </p>
      </div>

      {/* Farcaster Connection */}
      <div className="rounded-xl border text-card-foreground shadow p-6 bg-slate-800 border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Connect Your Farcaster Account</h2>
        </div>
        
        {!userSigner ? (
          <div className="space-y-4">
            <p className="text-slate-300">
              Connect your Farcaster account to post content directly from your profile.
            </p>
            <Button 
              onClick={createUserSigner}
              disabled={isCreatingSigner}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isCreatingSigner ? (
                <>
                  <User className="w-4 h-4 mr-2 animate-spin" />
                  Creating Signer...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Connect Farcaster Account
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300">
                  Signer Status: <span className={`font-semibold ${userSigner.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {userSigner.status}
                  </span>
                </p>
                {userSigner.fid && (
                  <p className="text-slate-400 text-sm">FID: {userSigner.fid}</p>
                )}
              </div>
              <div className="flex space-x-2">
                {userSigner.status !== 'approved' && (
                  <Button
                    onClick={checkSignerStatus}
                    disabled={isCheckingSigner}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {isCheckingSigner ? (
                      <>
                        <Link className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        Check Status
                      </>
                    )}
                  </Button>
                )}
                {userSigner.signer_approval_url && userSigner.status !== 'approved' && (
                  <Button
                    onClick={() => window.open(userSigner.signer_approval_url, '_blank')}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Approve Signer
                  </Button>
                )}
              </div>
            </div>
            {userSigner.status === 'approved' && (
              <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Your Farcaster account is connected and ready to post!
                </p>
              </div>
            )}
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
              placeholder="Paste your idea, thought, or reply here... (Kai will evolve it for maximum impact)"
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
                  Kai Evolution
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Kai Evolution
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
              disabled={isPosting || !userSigner || userSigner.status !== 'approved'}
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