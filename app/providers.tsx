'use client';

import { ReactNode } from 'react';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import ErrorBoundary from '../components/ErrorBoundary';

export function Providers(props: { children: ReactNode }) {
  return (
    <ClientOnlyWrapper>
      <WalletProvider>
        <ErrorBoundary>
          {props.children}
        </ErrorBoundary>
      </WalletProvider>
    </ClientOnlyWrapper>
  );
} 