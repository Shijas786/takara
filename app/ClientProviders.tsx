"use client";

import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [NeynarProvider, setNeynarProvider] = useState<
    null | ((props: { children: React.ReactNode }) => JSX.Element)
  >(null);

  useEffect(() => {
    let isMounted = true;

    import("@neynar/react").then((mod) => {
      if (mod.NeynarContextProvider && isMounted) {
        const ProviderWrapper = (props: { children: React.ReactNode }) => (
          <mod.NeynarContextProvider
            settings={{
              clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
            }}
          >
            {props.children}
          </mod.NeynarContextProvider>
        );
        setNeynarProvider(() => ProviderWrapper);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!NeynarProvider) return null; // loading state or fallback

  return <NeynarProvider>{children}</NeynarProvider>;
} 