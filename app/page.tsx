'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ContentGenerator from '../components/ContentGenerator';
import Navigation from '../components/Navigation';
import { Toaster } from '../components/ui/toaster';

export default function Home() {

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Content Generator Component */}
        <div className="mb-8">
          <ContentGenerator />
        </div>


      </main>
      <Toaster />
    </div>
  );
} 