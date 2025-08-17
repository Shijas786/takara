'use client';

import { ReactNode } from 'react';
import ClientOnlyWrapper from '../components/ClientOnlyWrapper';
import WalletProvider from '../components/WalletProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import type { StaticImageData } from 'next/image';
import AppLogo from '../components/logo/ChatGPT Image Jul 31, 2025, 01_08_33 PM.png';
import NeynarProvider from '../components/NeynarProvider';

export function Providers(props: { children: ReactNode }) {
  const appLogoUrl = `${(AppLogo as StaticImageData).src}?v=${process.env.NEXT_PUBLIC_ASSET_VERSION || '2'}`;
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