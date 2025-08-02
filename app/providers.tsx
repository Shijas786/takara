'use client';

import { ReactNode } from 'react';
import NeynarProviderWrapper from '../components/NeynarProvider';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';

export function Providers(props: { children: ReactNode }) {
  return (
    <ClientOnlyWrapper>
      <WalletProvider>
        <NeynarProviderWrapper>
          {props.children}
        </NeynarProviderWrapper>
      </WalletProvider>
    </ClientOnlyWrapper>
  );
} 