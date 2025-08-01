'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnlyWrapper - A comprehensive wrapper to prevent React hydration issues
 * This ensures components only render on the client side, preventing SSR mismatches
 */
export default function ClientOnlyWrapper({ 
  children, 
  fallback = (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ) 
}: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * SafeComponent - A wrapper that safely renders components with error boundaries
 */
export function SafeComponent({ 
  children, 
  fallback = <div>Component failed to load</div> 
}: ClientOnlyWrapperProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Component error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <ClientOnlyWrapper fallback={fallback}>{children}</ClientOnlyWrapper>;
} 