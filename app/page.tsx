import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Navigation from '../components/Navigation';
import { Toaster } from '../components/ui/toaster';

// Dynamically import the ContentGenerator to prevent SSR issues
const ContentGenerator = dynamic(() => import('../components/ContentGenerator'), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Content Takara Evolution</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Loading content generator...
        </p>
      </div>
    </div>
  ),
});

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