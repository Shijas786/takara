'use client';

import { NeynarProvider } from '@neynar/react';
import { ReactNode } from 'react';

interface NeynarProviderProps {
  children: ReactNode;
}

export default function NeynarProviderWrapper({ children }: NeynarProviderProps) {
  return (
    <NeynarProvider
      clientId={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || ''}
      environment="mainnet"
    >
      {children}
    </NeynarProvider>
  );
} 