"use client";

import { useEffect, useState } from "react";

// define a placeholder wrapper component
const Wrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [providerEl, setProviderEl] = useState<JSX.Element | null>(null);

  useEffect(() => {
    import("@neynar/react").then((mod) => {
      const El = (
        <mod.NeynarContextProvider
          settings={{
            clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
          }}
        >
          {children}
        </mod.NeynarContextProvider>
      );
      setProviderEl(El);
    });
  }, [children]);

  if (!providerEl) return <Wrapper>{children}</Wrapper>;

  return providerEl;
} 