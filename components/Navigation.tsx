'use client';

import { Home, Clock, Settings } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-700 bg-slate-800 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Kai</h1>
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
    </nav>
  );
} 