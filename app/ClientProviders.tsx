"use client";

import { NeynarContextProvider } from '@neynar/react';
import { ReactNode, useEffect, useState } from 'react';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render Neynar context during SSR to prevent hydration issues
  if (!isClient) {
    return <>{children}</>;
  }
  
  if (!clientId) {
    console.warn('NEXT_PUBLIC_NEYNAR_CLIENT_ID not configured, skipping Neynar context');
    return <>{children}</>;
  }

  try {
    return (
      <NeynarContextProvider
        settings={{
          clientId: clientId,
        }}
      >
        {children}
      </NeynarContextProvider>
    );
  } catch (error) {
    console.error('Error initializing Neynar context:', error);
    return <>{children}</>;
  }
}

// Add default export for compatibility
export default ClientProviders; 