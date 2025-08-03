'use client';

import { ReactNode } from 'react';
import NeynarProviderWrapper from '../components/NeynarProvider';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import { MiniAppProvider } from '@neynar/react';

export function Providers(props: { children: ReactNode }) {
  return (
    <ClientOnlyWrapper>
      <WalletProvider>
        <ErrorBoundary>
          <MiniAppProvider analyticsEnabled={false} backButtonEnabled={true}>
            <NeynarProviderWrapper>
              {props.children}
            </NeynarProviderWrapper>
          </MiniAppProvider>
        </ErrorBoundary>
      </WalletProvider>
    </ClientOnlyWrapper>
  );
} 