'use client';

import { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'viem/chains';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import ErrorBoundary from '../components/ErrorBoundary';

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'snake',
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <ClientOnlyWrapper>
        <WalletProvider>
          <ErrorBoundary>
            {props.children}
          </ErrorBoundary>
        </WalletProvider>
      </ClientOnlyWrapper>
    </MiniKitProvider>
  );
} 