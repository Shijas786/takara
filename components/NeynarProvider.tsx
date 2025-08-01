'use client';

import { ReactNode } from 'react';

interface NeynarProviderProps {
  children: ReactNode;
}

export default function NeynarProviderWrapper({ children }: NeynarProviderProps) {
  return (
    <div>
      {children}
    </div>
  );
} 