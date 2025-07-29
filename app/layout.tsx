import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kai - Transform Your Content to Viral Evolution',
  description: 'Transform ordinary content into viral success with AI-powered content evolution. Built for Base Wallet and Farcaster.',
  keywords: 'kai, content evolution, viral content, AI, Base, Farcaster, crypto, content creation, transformation',
  authors: [{ name: 'Kai Team' }],
  creator: 'Kai Content Evolution',
  publisher: 'Kai',
  robots: 'index, follow',
  openGraph: {
    title: 'Kai - Transform Your Content to Viral Evolution',
    description: 'Transform ordinary content into viral success with AI-powered content evolution.',
    url: 'https://kai.app',
    siteName: 'Kai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kai - Transform Your Content to Viral Evolution',
    description: 'Transform ordinary content into viral success with AI-powered content evolution.',
    creator: '@kai_app',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#8B5CF6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 