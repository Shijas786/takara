'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import NeynarContextProvider to avoid SSR issues
const NeynarContextProvider = dynamic(
  () => import('@neynar/react').then((mod) => ({ default: mod.NeynarContextProvider })),
  { ssr: false }
);

interface NeynarProviderProps {
  children: ReactNode;
}

export default function NeynarProviderWrapper({ children }: NeynarProviderProps) {
  return (
    <NeynarContextProvider
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '',
      }}
    >
      {children}
    </NeynarContextProvider>
  );
} 