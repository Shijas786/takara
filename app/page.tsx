'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ContentGenerator from '../components/ContentGenerator';
import Navigation from '../components/Navigation';
import { Toaster } from '../components/ui/toaster';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">

        {/* Content Generator Component */}
        <div className="mb-8">
          <ContentGenerator />
        </div>


      </main>
      <Toaster />
    </div>
  );
} 