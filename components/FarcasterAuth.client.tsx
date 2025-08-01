// components/FarcasterAuth.client.tsx
"use client";

import {
  NeynarAuthButton,
  useNeynarContext,
  SIWN_variant,
} from "@neynar/react";

export default function FarcasterAuthClient() {
  const { isAuthenticated, user } = useNeynarContext();

  if (!isAuthenticated) {
    return <NeynarAuthButton variant={SIWN_variant.FARCASTER} />;
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src={user?.pfp_url}
        alt={user?.display_name || "Farcaster User"}
        className="w-8 h-8 rounded-full"
      />
      <span>@{user?.username}</span>
    </div>
  );
} 