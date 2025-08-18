'use client';

import { ReactNode } from 'react';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import type { StaticImageData } from 'next/image';
// Using clean logo from public folder instead of suspicious logo file
import NeynarProvider from '../components/NeynarProvider';

export function Providers(props: { children: ReactNode }) {
  const appLogoUrl = '/takara-logo.png';
  return (
      <ClientOnlyWrapper>
        <NeynarProvider>
          <WalletProvider>
            <ErrorBoundary>
              {props.children}
            </ErrorBoundary>
          </WalletProvider>
        </NeynarProvider>
      </ClientOnlyWrapper>
  );
} 