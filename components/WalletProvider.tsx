'use client';

import { ReactNode, useEffect, useState } from 'react';
import { getWalletProvider } from '../lib/utils';

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const [walletProvider, setWalletProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for window to be available
    if (typeof window === 'undefined') {
      return;
    }

    // Handle wallet provider conflicts
    const handleWalletConflict = () => {
      try {
        const provider = getWalletProvider();
        setWalletProvider(provider);
      } catch (error) {
        console.warn('Wallet provider conflict detected:', error);
        // Fallback to first available provider
        setWalletProvider(window.ethereum || null);
      }
    };

    // Initial setup
    handleWalletConflict();
    setIsLoading(false);

    // Listen for wallet changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleWalletConflict);
      window.ethereum.on('chainChanged', handleWalletConflict);
    }

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleWalletConflict);
        window.ethereum.removeListener('chainChanged', handleWalletConflict);
      }
    };
  }, []);

  // Show loading state while detecting wallet
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 