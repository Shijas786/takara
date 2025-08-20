import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Takara - AI Content Creation on Base",
  description: "AI-powered content creation and Farcaster posting with Matrix Rain aesthetics. Built on Base with MiniKit integration.",
  generator: "v0.app",
  openGraph: {
    title: "Takara - AI Content Creation on Base",
    description: "AI-powered content creation and Farcaster posting with Matrix Rain aesthetics. Built on Base with MiniKit integration.",
    type: "website",
    images: [
      {
        url: "/takara-logo.png",
        width: 1200,
        height: 630,
        alt: "Takara Content Evolution",
      },
    ],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/takara-logo.png",
    "fc:frame:button:1": "Launch App",
    "fc:frame:post_url": "https://yourdomain.com", // Update with your actual domain
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/takara-logo.png" />
        <meta property="fc:frame:button:1" content="Launch App" />
        <meta property="fc:frame:post_url" content="https://yourdomain.com" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
