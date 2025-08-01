"use client";

import {
  NeynarAuthButton,
  useNeynarContext,
  SIWN_variant,
} from "@neynar/react";

export default function FarcasterAuthClient() {
  // Debug: Check if client ID is available
  console.log("CLIENT ID:", process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID);

  // Hook must be called at the top level, outside try-catch
  const { isAuthenticated, user } = useNeynarContext();

  // Strict guard: Only show auth button if not authenticated OR no user
  if (!isAuthenticated || !user) {
    return <NeynarAuthButton variant={SIWN_variant.FARCASTER} />;
  }

  try {
    // Safe user data rendering with fallbacks
    return (
      <div className="flex items-center gap-2">
        <img
          src={user?.pfp_url ?? "/fallback.png"}
          alt={user?.display_name ?? "Farcaster user"}
          className="w-8 h-8 rounded-full"
        />
        <span>@{user?.username ?? "unknown"}</span>
      </div>
    );
  } catch (err) {
    console.error("Farcaster render error", err);
    return (
      <div className="flex items-center gap-2 text-red-400">
        <span>⚠️ Auth Error</span>
      </div>
    );
  }
} 