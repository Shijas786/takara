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
    >
      {children}
    </NeynarProviderBase>
  );
} 