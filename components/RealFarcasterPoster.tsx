'use client'

import React from 'react'

export interface RealFarcasterPosterProps {
  content: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

// Minimal placeholder to satisfy CastComposer usage in development.
// In Mini App environments, posting is handled directly inside CastComposer.
export function RealFarcasterPoster(_props: RealFarcasterPosterProps) {
  return null
}

 