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
  const [sdk, setSdk] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Farcaster Mini App SDK
    const initSDK = async () => {
      try {
        if (typeof window !== 'undefined') {
          const { sdk: farcasterSDK } = await import('@farcaster/miniapp-sdk');
          setSdk(farcasterSDK);
          
          // Get the context
          const context = await farcasterSDK.context;
          
          // Call ready() to hide the splash screen
          await farcasterSDK.actions.ready();
          
          const actualState = {
            context,
            isFrameReady: true,
            setFrameReady: () => {
              console.log('Frame ready signal sent');
              if (sdk) {
                sdk.actions.ready();
              }
            }
          };
          
          onStateChange(actualState);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        
        // Fallback to placeholder state if SDK fails
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
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initSDK();
    }
  }, [onStateChange, isInitialized]);

  // This component doesn't render anything visible
  // It just manages MiniKit state and passes it to the parent
  return null;
} 