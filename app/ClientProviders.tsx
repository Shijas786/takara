// app/ClientProviders.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [Provider, setProvider] = useState<any>(null);

  useEffect(() => {
    // Dynamically import NeynarContextProvider on client only
    import("@neynar/react").then((mod) => {
      setProvider(mod.NeynarContextProvider);
    });
  }, []);

  if (!Provider) return null; // or a loading indicator

  return (
    <Provider settings={{
      clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '',
    }}>
      {children}
    </Provider>
  );
} 