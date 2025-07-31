'use client';

import { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
// import { MiniAppProvider } from '@neynar/react';
import { base } from 'viem/chains';

export function Providers(props: { children: ReactNode }) {
  return (
    // <MiniAppProvider analyticsEnabled={true}>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: 'auto',
            theme: 'snake',
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Content Enhancer',
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
      >
        {props.children}
      </MiniKitProvider>
    // </MiniAppProvider>
  );
} 