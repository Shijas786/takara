"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [NeynarContextProvider, setNeynarContextProvider] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@neynar/react").then((mod) => {
      // ✅ Store the component itself, not JSX
      setNeynarContextProvider(() => mod.NeynarContextProvider);
    });
  }, []);

  if (!NeynarContextProvider) {
    return null;
  }

  return (
    <NeynarContextProvider
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
      }}
    >
      {children}
    </NeynarContextProvider>
  );
} 