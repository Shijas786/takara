"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [Provider, setProvider] = useState<null | any>(null);

  useEffect(() => {
    import("@neynar/react").then((mod) => {
      setProvider(() => mod.NeynarContextProvider);
    });
  }, []);

  // Fallback guard: Ensure provider is ready and valid
  if (!Provider || typeof Provider !== "function") {
    console.warn("NeynarContextProvider not ready");
    return null;
  }

  return (
    <Provider
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
      }}
    >
      {children}
    </Provider>
  );
} 