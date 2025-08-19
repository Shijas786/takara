"use client"

import { useEffect } from "react"
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import LandingPage from "@/components/landing-page"

// Call Mini App ready when applicable
async function callMiniAppReadyIfAvailable() {
  try {
    const mod = await import("@farcaster/miniapp-sdk")
    const { sdk } = mod as { sdk: { actions: { ready: (opts?: { disableNativeGestures?: boolean }) => Promise<void> }, isInMiniApp: (timeoutMs?: number) => Promise<boolean> } }
    const inMini = await sdk.isInMiniApp()
    if (inMini) {
      await sdk.actions.ready()
    }
  } catch {}
}

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    // Initialize MiniKit frame when ready (following Base docs)
    if (!isFrameReady) {
      setFrameReady();
    }
    
    // Call existing Mini App ready function
    callMiniAppReadyIfAvailable()
  }, [setFrameReady, isFrameReady])

  return <LandingPage />
}