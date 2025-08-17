import { NextResponse } from 'next/server';

// Self-hosted manifest for development. In production, prefer hosted manifests via next.config.js redirect.
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || '';

  // NOTE: Replace the accountAssociation with signed values from the Farcaster developer tool
  const accountAssociation = process.env.ACCOUNT_ASSOCIATION_HEADER
    ? {
        header: process.env.ACCOUNT_ASSOCIATION_HEADER,
        payload: process.env.ACCOUNT_ASSOCIATION_PAYLOAD,
        signature: process.env.ACCOUNT_ASSOCIATION_SIGNATURE,
      }
    : undefined;

  const miniapp = {
    version: '1',
    name: 'Takara',
    iconUrl: `${appUrl}/takara-logo.png`,
    homeUrl: appUrl || 'https://takara-content-app.vercel.app',
    splashImageUrl: `${appUrl}/takara-logo.png`,
    splashBackgroundColor: '#6200EA',
    // Optional discovery fields
    description: 'Generate & share AI content seamlessly on Farcaster.',
  };

  const body = accountAssociation
    ? { accountAssociation, miniapp }
    : { miniapp };

  return NextResponse.json(body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

