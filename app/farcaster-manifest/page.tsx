import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Takara Farcaster Manifest',
  description: 'Farcaster manifest for Takara AI Content Generator',
};

export default function FarcasterManifestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-white">T</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Takara</h1>
          <p className="text-xl text-slate-300">Farcaster Manifest</p>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            This page serves as the Farcaster manifest for Takara AI Content Generator.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg max-w-2xl mx-auto text-left">
          <h2 className="text-xl font-semibold text-white mb-4">Manifest Details:</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p><strong>App Name:</strong> Takara</p>
            <p><strong>Description:</strong> AI-powered content generation and Farcaster posting</p>
            <p><strong>Frame URL:</strong> /frame</p>
            <p><strong>Action Endpoint:</strong> /api/frame/action</p>
            <p><strong>Features:</strong> Content generation, AI evolution, direct Farcaster posting</p>
            <p><strong>Integration:</strong> Neynar Mini App, Frame compatibility</p>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-sm text-slate-500">
            Use this URL in Base App to discover and interact with Takara
          </p>
        </div>
      </div>
    </div>
  );
} 