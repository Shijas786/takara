'use client';

import { ReactNode } from 'react';
import NeynarProviderWrapper from '../components/NeynarProvider';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import { MiniAppProvider } from '@neynar/react';

export function Providers(props: { children: ReactNode }) {
  return (
    <ClientOnlyWrapper>
      <WalletProvider>
        <MiniAppProvider analyticsEnabled={false} backButtonEnabled={true}>
          <NeynarProviderWrapper>
            {props.children}
          </NeynarProviderWrapper>
        </MiniAppProvider>
      </WalletProvider>
    </ClientOnlyWrapper>
  );
} 