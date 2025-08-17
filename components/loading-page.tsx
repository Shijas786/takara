"use client"

import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Takara Logo with Pulsing Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-3xl font-heading font-bold text-primary-foreground">T</span>
          </div>
          {/* Glowing Ring Effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl border-2 border-primary/30 animate-ping"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold text-foreground">Takara</h1>
          <p className="text-muted-foreground font-sans">Connecting to the decentralized web{dots}</p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
