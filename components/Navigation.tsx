'use client';

import { Home, Clock, Settings } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="https://freeimage.host/i/FS6Q5zb" 
                alt="Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">Kai</span>
            </Link>
            
            <div className="flex space-x-1">
              <Link href="/">
                <Button 
                  variant={pathname === '/' ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Generate</span>
                </Button>
              </Link>
              
              <Link href="/scheduled">
                <Button 
                  variant={pathname === '/scheduled' ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Scheduled</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 