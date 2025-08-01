'use client';

import { ReactNode } from 'react';
import { NeynarContextProvider } from '@neynar/react';

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