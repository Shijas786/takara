'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Send, Sparkles, MessageCircle, Loader2, Zap, TrendingUp, Copy, Check, Sparkles as Butterfly } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface MiniAppUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export default function WarpcastMiniApp() {
  const { context } = useMiniKit();
  const user: MiniAppUser | null = context?.user
    ? {
        fid: context.user.fid,
        username: context.user.username || '',
        displayName: context.user.displayName || context.user.username || '',
        pfpUrl: context.user.pfpUrl || '',
      }
    : null;
  
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('crypto');
  const [selectedLength, setSelectedLength] = useState('medium');

  const getMaxLength = (length: string) => {
    switch (length) {
      case 'short': return 100;
      case 'medium': return 280;
      case 'long': return 500;
      default: return 280;
    }
  };

  const generateContent = async () => {
    if (!postText.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: postText,
          style: selectedStyle,
          type: 'farcaster_post',
          maxLength: getMaxLength(selectedLength),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.content);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const postToFarcaster = async (text: string) => {
    if (!text.trim() || !context?.client) return;
    setIsPosting(true);
    try {
      // In-frame posting should be handled by parent using useMiniKit hooks/buttons
      // Here we just clear the state to avoid demo alerts
      setPostText('');
      setGeneratedContent('');
    } finally {
      setIsPosting(false);
    }
  };

  const enhanceAndPost = async () => {
    if (!postText.trim()) return;
    
    setIsGenerating(true);
    try {
      // Generate enhanced content
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Enhance this Farcaster post to be more engaging and viral: "${postText}"`,
          style: selectedStyle,
          type: 'farcaster_post',
          maxLength: getMaxLength(selectedLength),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const enhancedText = data.content;
        
        // Post the enhanced content directly
        await postToFarcaster(enhancedText);
      } else {
        // If generation fails, post the original text
        await postToFarcaster(postText);
      }
    } catch (error) {
      console.error('Error in enhance and post:', error);
      // Fallback to posting original text
      await postToFarcaster(postText);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {}
  };

  const styles = [
    { id: 'crypto', name: 'Crypto', icon: '🚀', color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'based', name: 'Based', icon: '⚡', color: 'bg-gradient-to-r from-green-400 to-blue-500' },
    { id: 'influencer', name: 'Influencer', icon: '💎', color: 'bg-gradient-to-r from-pink-500 to-red-500' },
    { id: 'reply', name: 'Reply', icon: '💬', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
  ];

  const lengths = [
    { id: 'short', name: 'Short', icon: '📝', maxChars: 100, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
    { id: 'medium', name: 'Medium', icon: '📄', maxChars: 280, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'long', name: 'Long', icon: '📚', maxChars: 500, color: 'bg-gradient-to-r from-purple-500 to-pink-600' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
      {/* Animated Butterfly Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Butterfly 1 - Top Left */}
        <div className="absolute top-20 left-10 animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Butterfly className="h-4 w-4 text-blue-300" />
          </div>
        </div>
        
        {/* Butterfly 2 - Top Right */}
        <div className="absolute top-32 right-16 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <div className="w-6 h-6 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Butterfly className="h-3 w-3 text-pink-300" />
          </div>
        </div>
        
        {/* Butterfly 3 - Middle Left */}
        <div className="absolute top-1/2 left-8 animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Butterfly className="h-5 w-5 text-green-300" />
          </div>
        </div>
        
        {/* Butterfly 4 - Middle Right */}
        <div className="absolute top-1/3 right-8 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
          <div className="w-7 h-7 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Butterfly className="h-4 w-4 text-yellow-300" />
          </div>
        </div>
        
        {/* Butterfly 5 - Bottom Left */}
        <div className="absolute bottom-32 left-20 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
          <div className="w-9 h-9 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Butterfly className="h-4 w-4 text-purple-300" />
          </div>
        </div>
        
        {/* Butterfly 6 - Bottom Right */}
        <div className="absolute bottom-20 right-12 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }}>
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400/30 to-green-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Butterfly className="h-3 w-3 text-blue-300" />
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/25 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.8s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-green-400/20 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6 p-4">
        {/* Butterfly Header */}
        {user && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
            <Card className="relative w-full border-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Butterfly className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Takara Evolution
                      </span>
                      <p className="text-xs text-gray-400">Powered by Base</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
                    Mini App
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    {user.pfpUrl ? (
                      <img 
                        src={user.pfpUrl} 
                        alt={user.displayName} 
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{user.displayName}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3" />
                        <span>FID: {user.fid}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Style & Length Selector */}
        <Card className="w-full border-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg text-white">
              <Zap className="h-5 w-5 text-blue-400" />
              <span>Content Style & Length</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Style Selector */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Choose Style:</h4>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedStyle === style.id
                        ? `${style.color} border-transparent text-white shadow-lg`
                        : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{style.icon}</span>
                      <span className="font-medium">{style.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selector */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Choose Length:</h4>
              <div className="grid grid-cols-3 gap-3">
                {lengths.map((length) => (
                  <button
                    key={length.id}
                    onClick={() => setSelectedLength(length.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedLength === length.id
                        ? `${length.color} border-transparent text-white shadow-lg`
                        : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{length.icon}</span>
                      <span className="font-medium text-sm">{length.name}</span>
                      <span className="text-xs opacity-75">{length.maxChars} chars</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Generation */}
        <Card className="w-full border-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg text-white">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>AI Content Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                What would you like to post about?
              </label>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Share your thoughts, ideas, or ask AI to help you create engaging content..."
                className="w-full p-4 border border-slate-600 rounded-xl resize-none bg-slate-700/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                rows={3}
                maxLength={getMaxLength(selectedLength)}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-400">
                  {postText.length}/{getMaxLength(selectedLength)} characters
                </span>
                <Button 
                  onClick={generateContent}
                  disabled={!postText.trim() || isGenerating}
                  size="sm"
                  variant="outline"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="border-t border-slate-600 pt-4">
                <h4 className="font-medium mb-3 text-gray-300 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Enhanced Content:</span>
                </h4>
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 rounded-xl border border-slate-600">
                  <p className="text-sm text-gray-200 leading-relaxed">{generatedContent}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button 
                    onClick={() => postToFarcaster(generatedContent)}
                    disabled={isPosting}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isPosting ? 'Posting...' : 'Post Enhanced'}
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(generatedContent)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-gray-300 hover:border-slate-500"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button 
                    onClick={() => setGeneratedContent('')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-gray-300 hover:border-slate-500"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Direct Post */}
            <div className="border-t border-slate-600 pt-4">
              <Button 
                onClick={enhanceAndPost}
                disabled={!postText.trim() || isPosting || isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                {isPosting || isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {isGenerating ? 'Enhancing...' : 'Posting...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Enhance & Post
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice with Butterfly */}
        <Card className="w-full border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Butterfly className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-200">
                  Demo Mode Active
                </p>
                <p className="text-xs text-blue-300/80">
                  This is a preview. When deployed to Warpcast, it will have full posting capabilities!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 