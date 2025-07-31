'use client';

import { NeynarProvider as NeynarProviderBase } from '@neynar/react';
import { ReactNode } from 'react';

interface NeynarProviderProps {
  children: ReactNode;
}

export default function NeynarProvider({ children }: NeynarProviderProps) {
  return (
    <NeynarProviderBase
      clientId={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || ''}
      environment="mainnet"
      // Disable Warpcast bridge for web app
      warpcastBridgeConfig={{
        enabled: false
      }}
      // Configure for web app
      webAppConfig={{
        enabled: true,
        redirectUrl: typeof window !== 'undefined' ? window.location.origin : 'https://takara-content-app.vercel.app'
      }}
    >
      {children}
    </NeynarProviderBase>
  );
} 