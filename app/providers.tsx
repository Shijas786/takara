'use client';

import { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import NeynarProviderWrapper from '../components/NeynarProvider';
import { base } from 'viem/chains';

export function Providers(props: { children: ReactNode }) {
  return (
    <NeynarProviderWrapper>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: 'auto',
            theme: 'snake',
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Takara Content Evolution',
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
      >
        {props.children}
              </MiniKitProvider>
      </NeynarProviderWrapper>
  );
} 