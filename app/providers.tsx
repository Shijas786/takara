'use client';

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';
import { base } from 'wagmi/chains';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import NeynarProvider from '../components/NeynarProvider';

export function Providers(props: { children: ReactNode }) {
  const appLogoUrl = '/takara-logo.png';
  
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'snake',
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Takara',
          logo: process.env.NEXT_PUBLIC_ICON_URL || appLogoUrl,
        },
      }}
    >
      <ClientOnlyWrapper>
        <NeynarProvider>
          <WalletProvider>
            <ErrorBoundary>
              {props.children}
            </ErrorBoundary>
          </WalletProvider>
        </NeynarProvider>
      </ClientOnlyWrapper>
    </MiniKitProvider>
  );
} 