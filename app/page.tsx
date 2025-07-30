'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ContentEnhancer from '../components/ContentEnhancer';

export default function Home() {
  const [farcasterFid, setFarcasterFid] = useState<string | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  const handlePostGenerated = (post: any) => {
    setGeneratedPosts(prev => [post, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Kai</h1>
                <p className="text-xs text-slate-400">Content Evolution</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1 text-slate-300 text-sm">
                PROFILE
              </button>
              <button className="px-3 py-1 text-slate-300 text-sm">
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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

        {/* Content Enhancer Component */}
        <ContentEnhancer 
          farcasterFid={farcasterFid}
          onPostGenerated={handlePostGenerated}
        />

        {/* CTA Section */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium mb-4">
            Add to Mini Apps
          </button>
          <div className="text-xs text-slate-500 mb-4">
            BUILT WITH MINIKIT
          </div>
          <div className="text-center">
            <a 
              href="/test-apis" 
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              🔧 Test API Configuration
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 