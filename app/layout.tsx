import type { Metadata, Viewport } from 'next'
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
}

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Block Coinbase analytics requests to prevent 401 errors
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
              if (typeof url === 'string' && url.includes('cca-lite.coinbase.com/metrics')) {
                return Promise.resolve(new Response('', { status: 200 }));
              }
              return originalFetch.apply(this, arguments);
            };
          `
        }} />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 