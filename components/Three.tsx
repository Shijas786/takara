'use client';

import { SafeImage } from './ui/image';
import AppLogo from './logo/ChatGPT Image Jul 31, 2025, 01_08_33 PM.png';
const logoSrc = `${(AppLogo as { src: string }).src}?v=${process.env.NEXT_PUBLIC_ASSET_VERSION || '2'}`;

export default function ThreeScene() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <SafeImage 
                  src={logoSrc} 
                  alt="Takara Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-cover"
                  fallbackSrc="https://placehold.co/32x32"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Takara</h1>
                <p className="text-xs text-slate-400">Content Evolution</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Content Takara Evolution
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Paste your idea, thought, or reply — and let Takara rework it using real styles from top crypto influencers. Whether it&apos;s a sharp quote, spicy reply, or a viral CTA, Takara evolves your words for maximum impact.
          </p>
          <p className="text-blue-400 text-sm">
            🦋 Link your Farcaster to save and post instantly.
          </p>
        </div>

        {/* Content Input Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Your Content</h3>
          <textarea 
            className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-400 resize-none"
            placeholder="Enter your content to evolve"
          />
          
          {/* Evolution Options */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Evolution Style</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white">
                <option>Viral Shitpost</option>
                <option>BASED</option>
                <option>Influencer Style</option>
                <option>Thread</option>
                <option>Reply Guy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Evolution Length</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white">
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Evolution Tone</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white">
                <option>Authentic</option>
                <option>Professional</option>
                <option>Casual</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium">
              Takara Evolution
            </button>
            <button className="px-4 py-2 text-slate-400">
              Clear
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">How Takara Evolution Works</h3>
          <p className="text-slate-300 mb-4">
            Paste your idea, thought, or reply — and let Takara rework it using real styles from top crypto influencers. Whether it&apos;s a sharp quote, spicy reply, or a viral CTA, Takara evolves your words for maximum impact. The AI is trained on 916+ authentic tweets from top crypto Twitter personalities.
          </p>
          <p className="text-blue-400 text-sm">
            🦋 <strong>Link your Farcaster</strong> to save your evolved content and post directly to Farcaster!
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium mb-4">
            Add to Mini Apps
          </button>
          <div className="text-xs text-slate-500">
            BUILT WITH MINIKIT
          </div>
        </div>
      </main>
    </div>
  );
} 