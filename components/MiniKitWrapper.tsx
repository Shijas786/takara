'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';

interface MiniKitWrapperProps {
  children: (context: any, isFrameReady: boolean) => ReactNode;
}

export default function MiniKitWrapper({ children }: MiniKitWrapperProps) {
  const { context, isFrameReady } = useMiniKit();
  return <>{children(context, isFrameReady)}</>;
} 