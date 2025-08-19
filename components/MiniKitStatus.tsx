'use client';

import { useEffect, useState } from 'react';

interface MiniKitStatusProps {
  onStateChange: (state: {
    context: any;
    isFrameReady: boolean;
    setFrameReady: () => void;
  }) => void;
}

export default function MiniKitStatus({ onStateChange }: MiniKitStatusProps) {
  const [miniKitState, setMiniKitState] = useState({
    context: null,
    isFrameReady: false,
    setFrameReady: () => {}
  });

  useEffect(() => {
    // Only initialize MiniKit on the client side
    try {
      const { useMiniKit } = require('@coinbase/onchainkit/minikit');
      const { context, isFrameReady, setFrameReady } = useMiniKit();
      const newState = { context, isFrameReady, setFrameReady };
      setMiniKitState(newState);
      onStateChange(newState);
    } catch (error) {
      console.log('MiniKit not available during SSR');
    }
  }, [onStateChange]);

  // Initialize frame when ready
  useEffect(() => {
    if (miniKitState.isFrameReady && miniKitState.setFrameReady) {
      miniKitState.setFrameReady();
    }
  }, [miniKitState.isFrameReady, miniKitState.setFrameReady]);

  // This component doesn't render anything visible
  // It just manages MiniKit state and passes it to the parent
  return null;
} 