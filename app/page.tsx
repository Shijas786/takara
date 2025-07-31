'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
// import { useMiniApp } from '@neynar/react';
import ContentGenerator from '../components/ContentGenerator';
import Navigation from '../components/Navigation';
import { Toaster } from '../components/ui/toaster';

export default function Home() {
  // const { isSDKLoaded, context } = useMiniApp();
  // const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(() => {
  //   if (isSDKLoaded && !isLoaded) {
  //     setIsLoaded(true);
  //   }
  // }, [isSDKLoaded, isLoaded]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Show Farcaster context if available */}
        {/* {isSDKLoaded && context && (
          <div className="mb-4 p-4 bg-blue-600 rounded-lg">
            <p className="text-sm">
              🦋 Connected to Farcaster Mini App
            </p>
          </div>
        )} */}

        {/* Content Generator Component */}
        <div className="mb-8">
          <ContentGenerator />
        </div>
      </main>
      <Toaster />
    </div>
  );
} 