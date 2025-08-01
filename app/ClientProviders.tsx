"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [ProviderComponent, setProviderComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@neynar/react").then((mod) => {
      if (mounted && mod?.NeynarContextProvider) {
        setProviderComponent(() => mod.NeynarContextProvider); // ✅ Store component, not JSX
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ProviderComponent) {
    console.log("NeynarContextProvider not ready");
    return null; // or fallback UI
  }

  console.log("About to render NeynarContextProvider:", ProviderComponent);

  return (
    <ProviderComponent
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
      }}
    >
      {children}
    </ProviderComponent>
  );
} 