"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [NeynarContextProvider, setNeynarContextProvider] = useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    import("@neynar/react").then((mod) => {
      // ✅ Save the actual component (NOT JSX)
      setNeynarContextProvider(() => mod.NeynarContextProvider);
    });
  }, []);

  if (!NeynarContextProvider) {
    console.warn("Provider not ready yet.");
    return null;
  }

  console.log("Rendering with provider:", NeynarContextProvider);

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