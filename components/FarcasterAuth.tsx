// components/FarcasterAuth.tsx
import dynamic from "next/dynamic";

const FarcasterAuthClient = dynamic(() => import("./FarcasterAuth.client"), {
  ssr: false,
  loading: () => <div>Loading Farcaster auth...</div>,
});

export default function FarcasterAuth() {
  return <FarcasterAuthClient />;
} 