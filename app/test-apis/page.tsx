'use client';

import { Sparkles } from 'lucide-react';
import ApiTestPanel from '../../components/ApiTestPanel';

export default function TestApisPage() {
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
                <h1 className="text-lg font-bold text-white">Takara</h1>
                <p className="text-xs text-slate-400">API Configuration Test</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <a 
                href="/" 
                className="px-3 py-1 text-slate-300 text-sm hover:text-white transition-colors"
              >
                BACK TO APP
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            API Configuration Test
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Use this panel to test all your API integrations and ensure they&apos;re properly configured. 
            Make sure you&apos;ve set up your environment variables before running the tests.
          </p>
          <div className="text-yellow-400 text-sm">
            ⚠️ Make sure to add your API keys to the .env.local file first!
          </div>
        </div>

        {/* API Test Panel */}
        <ApiTestPanel />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Need help setting up your API keys? Check the{' '}
            <a 
              href="/api-keys-setup" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              API Keys Setup Guide
            </a>
          </p>
        </div>
      </main>
    </div>
  );
} 