import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Takara - AI Content Generator',
  description: 'Generate AI-powered content and post directly to Farcaster',
  openGraph: {
    title: 'Takara - AI Content Generator',
    description: 'Generate AI-powered content and post directly to Farcaster',
    images: ['/takara-logo.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png',
    'fc:frame:button:1': 'Generate Content',
    'fc:frame:button:2': 'Post to Farcaster',
    'fc:frame:post_url': 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/api/frame/action',
  },
};

export default function FramePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-white">T</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Takara</h1>
          <p className="text-xl text-slate-300">AI Content Generator</p>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            Generate AI-powered content and post directly to Farcaster using our intelligent content evolution system.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Frame Compatible</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Base App Mini App</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Farcaster Integration</span>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-sm text-slate-500">
            Use the buttons above to interact with Takara in Base App
          </p>
        </div>
      </div>
    </div>
  );
} 