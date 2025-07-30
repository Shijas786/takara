'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Three.js component to avoid SSR issues
const ThreeScene = dynamic(() => import('../../components/Three'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading 3D Scene...</div>
    </div>
  )
});

export default function TestThreePage() {
  return (
    <div className="w-screen h-screen">
      <ThreeScene />
    </div>
  );
} 