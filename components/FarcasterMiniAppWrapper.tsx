"use client"

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterMiniAppWrapperProps {
  children: React.ReactNode
}

export default function FarcasterMiniAppWrapper({ children }: FarcasterMiniAppWrapperProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        // Initialize the Farcaster MiniApp SDK
        console.log('Initializing Farcaster MiniApp SDK...')
        
        // Wait for the app to be fully loaded and ready to display
        await sdk.actions.ready()
        
        console.log('Farcaster MiniApp SDK ready!')
        setIsReady(true)
      } catch (error) {
        console.error('Error initializing Farcaster MiniApp SDK:', error)
        // Still show the app even if SDK fails
        setIsReady(true)
      }
    }

    initializeFarcaster()
  }, [])

  // Show loading state while initializing
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-400">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-4">⚡</div>
          <div className="text-lg">Initializing Takara Content Evolution...</div>
          <div className="text-sm text-green-300 mt-2">Loading Farcaster MiniApp</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 