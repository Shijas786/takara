'use client';

import { ReactNode } from 'react';
// import { NeynarContextProvider } from '@neynar/react';

interface NeynarProviderProps {
  children: ReactNode;
}

export default function NeynarProviderWrapper({ children }: { children: React.ReactNode }) {
  // Temporarily disabled Neynar integration
  return <>{children}</>;
  
  // return (
  //   <NeynarContextProvider
  //     settings={{
  //       clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
  //     }}
  //   >
  //     {children}
  //   </NeynarContextProvider>
  // );
} 