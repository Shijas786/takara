'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from './ui/image';
import AppLogo from './logo/ChatGPT Image Jul 31, 2025, 01_08_33 PM.png';
const logoSrc = `${(AppLogo as { src: string }).src}?v=${process.env.NEXT_PUBLIC_ASSET_VERSION || '2'}`;

export default function Navigation() {
  return (
    <nav className="border-b border-slate-700 bg-slate-800 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
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
            </Link>
            
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
      </div>
    </nav>
  );
} 