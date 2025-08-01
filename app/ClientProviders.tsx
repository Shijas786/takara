// app/ClientProviders.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [NeynarProvider, setNeynarProvider] = useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    import("@neynar/react").then((mod) => {
      setNeynarProvider(() => mod.NeynarContextProvider);
    });
  }, []);

  if (!NeynarProvider) {
    // Optional: Add loading spinner or skeleton
    return null;
  }

  return (
    <NeynarProvider
      clientId={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!}
      environment="production"
    >
      {children}
    </NeynarProvider>
  );
} 