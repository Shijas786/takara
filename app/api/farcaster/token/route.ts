import { NextRequest, NextResponse } from 'next/server';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        sanitizeResponse({ error: 'Authorization code is required' }),
        { status: 400 }
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.farcaster.xyz/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID || '',
        client_secret: process.env.FARCASTER_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/farcaster-callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Farcaster token exchange error:', errorData);
      return NextResponse.json(
        sanitizeResponse({ error: 'Failed to exchange authorization code' }),
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json(sanitizeResponse({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    }));

  } catch (error) {
    console.error('Farcaster token API error:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 