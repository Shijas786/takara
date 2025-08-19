'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';

interface MiniKitWrapperProps {
  children: (context: any, isFrameReady: boolean) => ReactNode;
}

// Type for MiniKit context based on Base docs
interface MiniKitContext {
  user?: {
    fid?: number | string; // FID can be number or string
  };
  client?: {
    added?: boolean;
  };
  location?: string;
}

export default function MiniKitWrapper({ children }: MiniKitWrapperProps) {
  const { context, isFrameReady } = useMiniKit();
  return <>{children(context as any, isFrameReady)}</>;
} 