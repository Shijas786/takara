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
  title: "Takara – Web3's AI content engine",
  description: "Turn raw ideas into viral-ready Web3 content. Takara gives creators AI-crafted posts that resonate.",
  generator: "v0.app",
  openGraph: {
    title: "Takara – Web3's AI content engine",
    description: "Turn raw ideas into viral-ready Web3 content. Takara gives creators AI-crafted posts that resonate.",
    type: "website",
    images: [
      {
        url: "/takara-logo.png",
        width: 1200,
        height: 630,
        alt: "Takara – Web3's AI content engine",
      },
    ],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://takara-content-app.vercel.app/takara-logo.png",
      button: {
        title: "🚀 Launch",
        action: {
          type: "launch_miniapp",
          name: "Takara – Web3's AI content engine",
          url: "https://takara-content-app.vercel.app",
          splashImageUrl: "https://takara-content-app.vercel.app/takara-logo.png",
          splashBackgroundColor: "#000000"
        }
      }
    }),
    // For backward compatibility
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://takara-content-app.vercel.app/takara-logo.png",
      button: {
        title: "🚀 Launch",
        action: {
          type: "launch_frame",
          name: "Takara – Web3's AI content engine",
          url: "https://takara-content-app.vercel.app",
          splashImageUrl: "https://takara-content-app.vercel.app/takara-logo.png",
          splashBackgroundColor: "#000000"
        }
      }
    })
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
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
