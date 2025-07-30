'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Save, MessageCircle, Clock, Trash2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
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
          style: 'shitpost',
          length: 'medium',
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
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img 
            src="https://freeimage.host/i/FS6Q5zb" 
            alt="Logo" 
            className="w-12 h-12 rounded-lg"
          />
          <h1 className="text-3xl font-bold text-gray-900">Kai Content Generator</h1>
        </div>
        <p className="text-gray-600">Generate AI-powered content and share it with the world</p>
      </div>

      {/* Content Generation */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Generate Content</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your prompt
            </label>
            <Textarea
              placeholder="e.g., Generate a funny crypto shitpost in CT slang about Bitcoin going to the moon..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 resize-none"
              disabled={isGenerating}
            />
          </div>

          <Button 
            onClick={generateContent}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ready
            </Badge>
          </div>

          <div className="p-4 bg-white rounded-lg border border-green-200 mb-4">
            <p className="text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <Button 
              onClick={downloadContent}
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button 
              onClick={saveDraft}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button 
              onClick={() => schedulePost(generatedContent)}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
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
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <Save className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Your Drafts</h3>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {drafts.length}/10
            </Badge>
          </div>

          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="p-4 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(draft.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-gray-900 text-sm mb-2">{draft.content}</p>
                    <p className="text-xs text-gray-500 italic">"{draft.prompt}"</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      onClick={() => setGeneratedContent(draft.content)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                    <Button 
                      onClick={() => deleteDraft(draft.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Connect to Farcaster</h3>
            <p className="text-gray-600 mb-4">
              Scan the QR code with your Warpcast app to connect your Farcaster account.
            </p>
            <div className="text-center">
              <div className="p-4 bg-gray-100 rounded-lg mb-4">
                <p className="text-sm text-gray-500">QR Code will appear here</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowFarcasterModal(false)}
                  variant="outline"
                  className="flex-1"
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