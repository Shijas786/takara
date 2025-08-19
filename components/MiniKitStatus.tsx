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
  useEffect(() => {
    // For now, provide placeholder MiniKit state
    // This will be replaced with actual MiniKit integration later
    const placeholderState = {
      context: {
        user: { fid: 'demo_user' },
        client: { added: false, clientFid: '309857' },
        location: 'launcher'
      },
      isFrameReady: true,
      setFrameReady: () => console.log('Frame ready signal sent')
    };
    
    onStateChange(placeholderState);
  }, [onStateChange]);

  // This component doesn't render anything visible
  // It just manages MiniKit state and passes it to the parent
  return null;
} 