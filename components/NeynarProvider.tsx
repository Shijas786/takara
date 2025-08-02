'use client';

import { NeynarContextProvider } from '@neynar/react';

interface NeynarProviderProps {
  children: React.ReactNode;
}

export default function NeynarProviderWrapper({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  if (!clientId) {
    console.warn('NEXT_PUBLIC_NEYNAR_CLIENT_ID not configured, skipping Neynar context');
    return <>{children}</>;
  }

  return (
    <NeynarContextProvider
      settings={{
        clientId: clientId
      }}
    >
      {children}
    </NeynarContextProvider>
  );
} 