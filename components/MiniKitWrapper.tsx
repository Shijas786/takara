'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';

interface MiniKitWrapperProps {
  children: (context: any, isFrameReady: boolean) => ReactNode;
}

export default function MiniKitWrapper({ children }: MiniKitWrapperProps) {
  try {
    const { context, isFrameReady } = useMiniKit();
    return <>{children(context, isFrameReady)}</>;
  } catch (error) {
    // Fallback when MiniKit is not available (during SSR)
    return <>{children(null, false)}</>;
  }
} 