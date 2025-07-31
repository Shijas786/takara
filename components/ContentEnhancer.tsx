'use client';

import React, { useState } from 'react';
import { Sparkles, Zap, Edit3, Copy, Share2, RefreshCw, TrendingUp, MessageSquare, Hash, Zap as ZapIcon } from 'lucide-react';
import { openaiService } from '../lib/openai';
import { viralScoreCalculator } from '../lib/viralScore';
import { supabaseService } from '../lib/supabase';

interface ContentEnhancerProps {
  farcasterFid: string | null;
  onPostGenerated: (post: any) => void;
}

export default function ContentEnhancer({
  farcasterFid,
  onPostGenerated,
}: ContentEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [viralScore, setViralScore] = useState<any>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [enhancementSettings, setEnhancementSettings] = useState({
    style: 'shitpost' as 'shitpost' | 'based' | 'influencer' | 'thread' | 'reply',
    length: 'medium' as 'short' | 'medium' | 'long',
    tone: 'authentic' as 'authentic' | 'professional' | 'casual',
  });
  const [error, setError] = useState<string | null>(null);

  const enhanceContent = async () => {
    if (!userInput.trim()) {
      setError('Please enter some content to evolve');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      // Create a mock influencer for the AI service (we don't need real influencer selection)
      const mockInfluencer = {
        id: 'takara',
        name: 'Takara Evolution',
        handle: 'takara_evolution',
        avatar: '',
        description: 'AI-powered content evolution tool',
        style: 'crypto',
        followers: 0,
        category: 'crypto' as const,
        sampleTweets: [],
      };

      const request = {
        influencerId: 'takara',
        mixedInfluencerId: undefined,
        prompt: userInput,
        style: enhancementSettings.style,
        length: enhancementSettings.length,
      };

      // Call the server-side API route instead of direct OpenAI call
      const response = await fetch('/api/openai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userInput,
          style: enhancementSettings.style,
          length: enhancementSettings.length,
          influencerId: 'takara',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate content');
      }

      const enhanced = result.content;

      setEnhancedContent(enhanced);
      setEditedContent(enhanced);

      // Calculate viral score
      const score = viralScoreCalculator.calculateViralScore(enhanced);
      setViralScore(score);

      // Save to Supabase only if Farcaster is connected
      if (farcasterFid) {
        const savedPost = await supabaseService.saveGeneratedPost({
          content: enhanced,
          influencer: mockInfluencer,
          mixedInfluencer: undefined,
          viralScore: score.totalScore,
          createdAt: new Date(),
          userId: farcasterFid,
          isPosted: false,
        });
        onPostGenerated(savedPost);
      } else {
        // For Web2 users, just call the callback with the enhanced content
        onPostGenerated({
          content: enhanced,
          viralScore: score.totalScore,
          createdAt: new Date(),
        });
      }
    } catch (error: any) {
      if (error.message?.includes('API key not configured') || error.message?.includes('401') || error.message?.includes('AuthenticationError')) {
        setError('OpenAI API key not configured. Please add your OpenAI API key to the .env.local file. See QUICK_SETUP.md for instructions. Need help? Check the setup guide in the project root.');
      } else if (error.message?.includes('404') || error.message?.includes('does not exist')) {
        setError('Model access issue. Please check your OpenAI subscription and try again.');
      } else if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RateLimit')) {
        setError('Rate limit reached. Please wait a moment and try again, or check your OpenAI billing.');
      } else {
        setError(error.message || 'Failed to evolve content. Please try again.');
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const regenerateContent = () => {
    if (userInput.trim()) {
      enhanceContent();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedContent);
  };

  const updateViralScore = () => {
    if (editedContent.trim()) {
      const score = viralScoreCalculator.calculateViralScore(editedContent);
      setViralScore(score);
    }
  };

  const clearContent = () => {
    setUserInput('');
    setEnhancedContent('');
    setEditedContent('');
    setViralScore(null);
    setError(null);
  };

  const postToFarcaster = async () => {
    if (!farcasterFid) {
      setError('Please connect your Farcaster account first');
      return;
    }

    try {
      // Save the post to Supabase
      const mockInfluencer = {
        id: 'takara',
        name: 'Takara Evolution',
        handle: 'takara_evolution',
        avatar: '',
        description: 'AI-powered content evolution tool',
        style: 'crypto',
        followers: 0,
        category: 'crypto' as const,
        sampleTweets: [],
      };

      const savedPost = await supabaseService.saveGeneratedPost({
        content: editedContent,
        influencer: mockInfluencer,
        mixedInfluencer: undefined,
        viralScore: viralScore?.totalScore || 0,
        createdAt: new Date(),
        userId: farcasterFid,
        isPosted: true,
      });

      onPostGenerated(savedPost);
      setError(null);
    } catch (error: any) {
      setError('Failed to post to Farcaster. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-400/20 hover:shadow-2xl transition-all duration-300 animate-float-3d">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-300 animate-pulse" />
          <h2 className="text-xl font-semibold text-blue-100">Your Content</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Enter your content to evolve</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Paste your idea, thought, or reply here... (Takara will evolve it for maximum impact)"
              className="w-full h-32 px-3 py-2 border border-blue-400/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-blue-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md text-blue-100 placeholder-blue-300/50 animate-input-3d"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Evolution Style</label>
              <select
                value={enhancementSettings.style}
                onChange={(e) => setEnhancementSettings({ ...enhancementSettings, style: e.target.value as any })}
                className="w-full px-3 py-2 border border-blue-400/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md text-blue-100 animate-select-3d"
              >
                <option value="shitpost">Viral Shitpost</option>
                <option value="based">BASED</option>
                <option value="influencer">Influencer Style</option>
                <option value="thread">Thread</option>
                <option value="reply">Reply Guy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Evolution Length</label>
              <select
                value={enhancementSettings.length}
                onChange={(e) => setEnhancementSettings({ ...enhancementSettings, length: e.target.value as any })}
                className="w-full px-3 py-2 border border-blue-400/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md text-blue-100 animate-select-3d"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Evolution Tone</label>
              <select
                value={enhancementSettings.tone}
                onChange={(e) => setEnhancementSettings({ ...enhancementSettings, tone: e.target.value as any })}
                className="w-full px-3 py-2 border border-blue-400/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md text-blue-100 animate-select-3d"
              >
                <option value="authentic">Authentic</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              data-enhance-button="true"
              onClick={enhanceContent}
              disabled={isEnhancing || !userInput.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-blue-100 py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 btn-evolution border border-blue-400/30 animate-button-3d"
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : 'animate-pulse'}`} />
                <span>{isEnhancing ? 'Evolving...' : 'Takara Evolution'}</span>
              </div>
            </button>
            <button
              onClick={clearContent}
              className="px-4 py-3 text-blue-300 hover:text-blue-100 transition-all duration-300 bg-blue-700/30 backdrop-blur-sm rounded-xl hover:scale-105 hover:shadow-md border border-blue-400/20 animate-clear-3d"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      {enhancedContent && (
        <div className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-400/20 hover:shadow-2xl transition-all duration-300 animate-float-3d">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
              <h2 className="text-xl font-semibold text-blue-100">Evolved Content</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={regenerateContent}
                disabled={isEnhancing}
                className="p-2 text-blue-300 hover:text-blue-100 transition-all duration-300 bg-blue-700/30 backdrop-blur-sm rounded-lg hover:scale-110 hover:shadow-md border border-blue-400/20 animate-icon-3d"
                title="Regenerate content"
              >
                <RefreshCw className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 text-blue-300 hover:text-blue-100 transition-all duration-300 bg-blue-700/30 backdrop-blur-sm rounded-lg hover:scale-110 hover:shadow-md border border-blue-400/20 animate-icon-3d"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-blue-400/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-blue-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md text-blue-100 placeholder-blue-300/50 animate-output-3d"
              placeholder="Your evolved content will appear here..."
            />
            <div className="flex justify-between items-center">
              <button
                onClick={updateViralScore}
                className="text-sm text-blue-300 hover:text-blue-100 font-medium bg-blue-700/30 backdrop-blur-sm px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md border border-blue-400/20 animate-score-3d"
              >
                Update Viral Score
              </button>
              {farcasterFid && (
                <button
                  onClick={postToFarcaster}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-blue-100 px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 btn-evolution border border-blue-400/30 animate-post-3d"
                >
                  Post to Farcaster
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Viral Score Section */}
      {viralScore && (
        <div className="bg-gradient-to-r from-blue-700/50 to-indigo-700/50 border border-blue-400/30 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-float-3d">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-100">Viral Evolution Score</h3>
            <div className="text-2xl font-bold text-gradient animate-pulse animate-score-display-3d">{viralScore.totalScore}/100</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between">
                <span className="text-blue-200">Engagement</span>
                <span className="font-medium text-blue-100">{viralScore.engagement}/25</span>
              </div>
              <div className="w-full bg-blue-800/50 rounded-full h-2 mt-1 overflow-hidden animate-progress-3d">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-fill-3d" style={{ width: `${(viralScore.engagement / 25) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-blue-200">Reach</span>
                <span className="font-medium text-blue-100">{viralScore.reach}/25</span>
              </div>
              <div className="w-full bg-blue-800/50 rounded-full h-2 mt-1 overflow-hidden animate-progress-3d">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-fill-3d" style={{ width: `${(viralScore.reach / 25) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-blue-200">Virality</span>
                <span className="font-medium text-blue-100">{viralScore.virality}/25</span>
              </div>
              <div className="w-full bg-blue-800/50 rounded-full h-2 mt-1 overflow-hidden animate-progress-3d">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-fill-3d" style={{ width: `${(viralScore.virality / 25) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-blue-200">Quality</span>
                <span className="font-medium text-blue-100">{viralScore.quality}/25</span>
              </div>
              <div className="w-full bg-blue-800/50 rounded-full h-2 mt-1 overflow-hidden animate-progress-3d">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-fill-3d" style={{ width: `${(viralScore.quality / 25) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm animate-pulse animate-error-3d">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-800/50 rounded-full flex items-center justify-center animate-error-icon-3d">
                <span className="text-red-200 text-xs font-bold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-200">Evolution Error</h3>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced How it works */}
      <div className="bg-gradient-to-r from-blue-700/50 to-indigo-700/50 border border-blue-400/30 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-float-3d">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-300 mt-0.5 animate-pulse" />
          <div>
            <h3 className="text-sm font-medium text-blue-100 mb-1">How Takara Evolution Works</h3>
            <p className="text-sm text-blue-200 mb-2">
              Paste your idea, thought, or reply — and let Takara rework it using real styles from top crypto influencers. Whether it's a sharp quote, spicy reply, or a viral CTA, Takara evolves your words for maximum impact. The AI is trained on 916+ authentic tweets from top crypto Twitter personalities.
            </p>
            <p className="text-sm text-blue-300">
              🦋 <strong>Link your Farcaster</strong> to save your evolved content and post directly to Farcaster!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 