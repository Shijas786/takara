import { NextResponse } from 'next/server';
import { sanitizeResponse } from '../../../lib/sanitizeResponse';

export async function GET() {
  const manifest = {
    name: 'Takara Content Evolution',
    description: 'AI-powered content generation and scheduling platform',
    icon: process.env.NEXT_PUBLIC_ICON_URL || 'https://placeholder.com/icon.png',
    appUrl: process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
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