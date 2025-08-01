'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ContentGenerator from '../components/ContentGenerator';
import Navigation from '../components/Navigation';
import FarcasterAuth from '../components/FarcasterAuth';
import PostToFarcaster from '../components/PostToFarcaster';
import { Toaster } from '../components/ui/toaster';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Farcaster Authentication Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Connect to Farcaster</h2>
            <p className="text-slate-300">
              Link your Farcaster account to save and post content directly
            </p>
          </div>
          <FarcasterAuth />
        </div>

        {/* Content Generator Component */}
        <div className="mb-8">
          <ContentGenerator />
        </div>

        {/* Post to Farcaster Component */}
        <div className="mb-8">
          <PostToFarcaster />
        </div>
      </main>
      <Toaster />
    </div>
  );
} 