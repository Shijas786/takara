import { NextResponse } from 'next/server';
import { sanitizeResponse } from '../../../lib/sanitizeResponse';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://takara-content-app.vercel.app';
  const manifest = {
    name: 'Takara Content Evolution',
    description: 'AI-powered content generation and scheduling platform',
    icon: process.env.NEXT_PUBLIC_ICON_URL || `${appUrl}/takara-logo.png`,
    appUrl: appUrl,
    miniapp: {
      name: 'Takara',
      version: 1,
      iconUrl: `${appUrl}/takara-logo.png`,
      homeUrl: appUrl,
      splashBackgroundColor: '#6200EA',
      buttonTitle: 'Launch Takara',
      description: 'Generate & share AI content seamlessly on Farcaster.',
      primaryCategory: 'social',
      subtitle: 'AI-Powered Content Creation',
      webhookUrl: `${appUrl}/api/webhook`,
    },
    appId: process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID || '',
    noIndex: true,
  };

  return NextResponse.json(sanitizeResponse(manifest));
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 