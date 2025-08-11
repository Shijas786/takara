import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import { Providers } from "./providers";
import Script from "next/script";
import Navigation from "../components/Navigation";
import AppLogo from "../components/logo/ChatGPT Image Jul 31, 2025, 01_08_33 PM.png";
const appLogoPath = (AppLogo as { src: string }).src;
const appLogoUrl = `${appLogoPath}?v=${process.env.NEXT_PUBLIC_ASSET_VERSION || '2'}`;
const publicUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || '';
const absoluteLogoUrl = publicUrl ? `${publicUrl}${appLogoUrl}` : appLogoUrl;
const frameImageUrl = publicUrl ? `${publicUrl}/takara-logo.png?v=${process.env.NEXT_PUBLIC_ASSET_VERSION || '2'}` : `/takara-logo.png?v=${process.env.NEXT_PUBLIC_ASSET_VERSION || '2'}`;

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || "";

export const metadata: Metadata = {
  title: "Takara - AI-Powered Content Creation",
  description: "Generate & share AI content seamlessly on Farcaster.",
  icons: {
    icon: [{ url: absoluteLogoUrl }],
    apple: [{ url: absoluteLogoUrl }],
    shortcut: [{ url: absoluteLogoUrl }],
  },
  openGraph: {
    title: "Takara - AI-Powered Content Creation",
    description: "Generate & share AI content seamlessly on Farcaster.",
    url: publicUrl || "https://takara-content-app.vercel.app",
    siteName: "Takara",
    images: [
      {
        url: `${publicUrl || ""}/takara-logo.png`,
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
    images: [`${publicUrl || ""}/takara-logo.png`],
  },
  other: {
    "fc:frame": "vNext",
    // Provide required frame tags so root can validate as a frame if shared
    "fc:frame:image": process.env.NEXT_PUBLIC_FRAME_IMAGE_URL || `${publicUrl || ''}/api/og?prompt=Takara`,
    "fc:frame:post_url": publicUrl ? `${publicUrl}/frame` : '/frame',
    "fc:frame:button:1": "Open Takara",
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
        <Navigation />
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