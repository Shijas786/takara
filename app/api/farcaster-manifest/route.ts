import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Kai Content Evolution',
    description: 'AI-powered content generation and scheduling platform',
    icon: 'https://placeholder.com/icon.png',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    appId: process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID || '',
  };

  return NextResponse.json(manifest);
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