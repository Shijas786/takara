import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Takara - AI-Powered Content Creation",
  description: "Generate & share AI content seamlessly on Farcaster.",
  openGraph: {
    title: "Takara - AI-Powered Content Creation",
    description: "Generate & share AI content seamlessly on Farcaster.",
    url: "https://takara-content-app.vercel.app",
    siteName: "Takara",
    images: [
      {
        url: "https://takara-content-app.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Takara - AI-Powered Content Creation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Takara - AI-Powered Content Creation",
    description: "Generate & share AI content seamlessly on Farcaster.",
    images: ["https://takara-content-app.vercel.app/og-image.png"],
  },
  other: {
    "fc:frame": "vNext",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Load suppression early to catch deprecation/analytics logs */}
        <Script
          src="/suppress-errors.js"
          strategy="beforeInteractive"
          id="error-suppression-script"
        />
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Script 
          src="/wallet-conflict-fix.js" 
          strategy="afterInteractive"
          id="wallet-conflict-script"
        />
      </body>
    </html>
  );
} 