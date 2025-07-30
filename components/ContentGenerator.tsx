'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Save, MessageCircle, Clock, Trash2, CheckCircle } from 'lucide-react';
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

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [evolutionStyle, setEvolutionStyle] = useState('viral-shitpost');
  const [evolutionLength, setEvolutionLength] = useState('medium');
  const [evolutionTone, setEvolutionTone] = useState('authentic');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const [showFarcasterModal, setShowFarcasterModal] = useState(false);
  const { toast } = useToast();

  // Load drafts and scheduled posts from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('kai_drafts');
    const savedScheduled = localStorage.getItem('kai_scheduled_posts');
    const farcasterToken = localStorage.getItem('farcaster_token');

    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
    if (savedScheduled) {
      setScheduledPosts(JSON.parse(savedScheduled));
    }
    if (farcasterToken) {
      setIsFarcasterConnected(true);
    }
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

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-generated post is ready",
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadContent = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kai-post-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Content saved as text file",
    });
  };

  const saveDraft = () => {
    if (!generatedContent || !prompt) return;
    
    const newDraft: Draft = {
      id: Date.now().toString(),
      content: generatedContent,
      prompt: prompt,
      timestamp: Date.now(),
    };

    const updatedDrafts = [newDraft, ...drafts.slice(0, 9)]; // Keep only 10 drafts
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
    const timeSlots = ['10:00 AM', '2:00 PM', '8:00 PM'];
    const availableSlots = timeSlots.filter(slot => 
      !scheduledPosts.some(post => post.timeSlot === slot && !post.isPosted)
    );

    if (availableSlots.length === 0) {
      toast({
        title: "No Available Slots",
        description: "All time slots are already scheduled",
        variant: "destructive",
      });
      return;
    }

    const selectedSlot = availableSlots[0];
    const scheduledTime = new Date();
    scheduledTime.setHours(
      selectedSlot.includes('10') ? 10 : selectedSlot.includes('2') ? 14 : 20,
      0, 0, 0
    );

    const newScheduledPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      scheduledTime: scheduledTime.toISOString(),
      timeSlot: selectedSlot,
      isPosted: false,
    };

    const updatedScheduled = [...scheduledPosts, newScheduledPost];
    setScheduledPosts(updatedScheduled);
    localStorage.setItem('kai_scheduled_posts', JSON.stringify(updatedScheduled));
    
    toast({
      title: "Post Scheduled!",
      description: `Scheduled for ${selectedSlot}`,
    });
  };

  const postToFarcaster = async () => {
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Please generate content first",
        variant: "destructive",
      });
      return;
    }

    if (!isFarcasterConnected) {
      setShowFarcasterModal(true);
      return;
    }

    // Post to Farcaster using stored token
    try {
      const response = await fetch('/api/farcaster/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: generatedContent,
        }),
      });

      if (response.ok) {
        toast({
          title: "Posted to Farcaster!",
          description: "Your content is now live on Farcaster",
        });
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      toast({
        title: "Post Failed",
        description: "Failed to post to Farcaster. Please reconnect.",
        variant: "destructive",
      });
      setIsFarcasterConnected(false);
      localStorage.removeItem('farcaster_token');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Content Kai Evolution
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Paste your idea, thought, or reply — and let Kai rework it using real styles from top crypto influencers. Whether it's a sharp quote, spicy reply, or a viral CTA, Kai evolves your words for maximum impact.
        </p>
        <p className="text-blue-400 text-sm">
          🦋 Link your Farcaster to save and post instantly.
        </p>
      </div>

      {/* Content Generation */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-blue-400" />
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
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Evolution Style
              </label>
              <Select value={evolutionStyle} onValueChange={setEvolutionStyle}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="viral-shitpost">Viral Shitpost</SelectItem>
                  <SelectItem value="sharp-quote">Sharp Quote</SelectItem>
                  <SelectItem value="spicy-reply">Spicy Reply</SelectItem>
                  <SelectItem value="viral-cta">Viral CTA</SelectItem>
                  <SelectItem value="alpha-leak">Alpha Leak</SelectItem>
                  <SelectItem value="fud-buster">FUD Buster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Evolution Length
              </label>
              <Select value={evolutionLength} onValueChange={setEvolutionLength}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Evolution Tone
              </label>
              <Select value={evolutionTone} onValueChange={setEvolutionTone}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="authentic">Authentic</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="mysterious">Mysterious</SelectItem>
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
                  Generating...
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
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Generated Content</h3>
            </div>
            <Badge variant="secondary" className="bg-green-900 text-green-300">
              Ready
            </Badge>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg border border-slate-600 mb-4">
            <p className="text-white whitespace-pre-wrap">{generatedContent}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="text-blue-400 border-blue-500 hover:bg-blue-900"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <Button 
              onClick={downloadContent}
              variant="outline"
              size="sm"
              className="text-purple-400 border-purple-500 hover:bg-purple-900"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button 
              onClick={saveDraft}
              variant="outline"
              size="sm"
              className="text-green-400 border-green-500 hover:bg-green-900"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button 
              onClick={() => schedulePost(generatedContent)}
              variant="outline"
              size="sm"
              className="text-orange-400 border-orange-500 hover:bg-orange-900"
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
            
            <Button 
              onClick={postToFarcaster}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {isFarcasterConnected ? 'Post to Farcaster' : 'Connect & Post'}
            </Button>
          </div>
        </Card>
      )}

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <Save className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Your Drafts</h3>
            <Badge variant="secondary" className="bg-yellow-900 text-yellow-300">
              {drafts.length}/10
            </Badge>
          </div>

          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 mb-2">
                      {new Date(draft.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-white text-sm mb-2">{draft.content}</p>
                    <p className="text-xs text-slate-400 italic">"{draft.prompt}"</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      onClick={() => setGeneratedContent(draft.content)}
                      variant="outline"
                      size="sm"
                      className="text-blue-400 border-blue-500 hover:bg-blue-900"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                    <Button 
                      onClick={() => deleteDraft(draft.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-500 hover:bg-red-900"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Farcaster Connection Modal */}
      {showFarcasterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Connect to Farcaster</h3>
            <p className="text-slate-300 mb-4">
              Scan the QR code with your Warpcast app to connect your Farcaster account.
            </p>
            <div className="text-center">
              <div className="p-4 bg-slate-700 rounded-lg mb-4 border border-slate-600">
                <p className="text-sm text-slate-400">QR Code will appear here</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowFarcasterModal(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // TODO: Implement QR code generation
                    setShowFarcasterModal(false);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Generate QR
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 