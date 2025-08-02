'use client';

import { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';

import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import { base } from 'viem/chains';

export function Providers(props: { children: ReactNode }) {
  return (
    <ClientOnlyWrapper>
      <WalletProvider>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: 'auto',
              theme: 'snake',
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Takara Content Evolution',
              logo: 'https://takara-content-app.vercel.app/takara-logo.png',
            },
          }}
        >
                           {props.children}
        </MiniKitProvider>
      </WalletProvider>
    </ClientOnlyWrapper>
  );
} 