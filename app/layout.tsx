import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from './ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Takara - Transform Your Content to Viral Evolution',
  description: 'Transform ordinary content into viral success with AI-powered content evolution. Built for Base Wallet and Farcaster.',
  keywords: 'takara, content evolution, viral content, AI, Base, Farcaster, crypto, content creation, transformation',
  authors: [{ name: 'Takara Team' }],
  creator: 'Takara Content Evolution',
  publisher: 'Takara',
  robots: 'index, follow',
  openGraph: {
    title: 'Takara - Transform Your Content to Viral Evolution',
    description: 'Transform ordinary content into viral success with AI-powered content evolution.',
    url: 'https://takara.app',
    siteName: 'Takara',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Takara - Transform Your Content to Viral Evolution',
    description: 'Transform ordinary content into viral success with AI-powered content evolution.',
    creator: '@takara_app',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
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
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://takara.app/og-image.png","button":{"title":"🚀 Evolve Content","action":{"type":"launch_miniapp","name":"TAKARA Content Evolution","url":"https://takara.app","splashImageUrl":"https://takara.app/takara-logo.png","splashBackgroundColor":"#1e293b"}}}' />
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
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
} 