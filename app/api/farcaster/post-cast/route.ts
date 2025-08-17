import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@farcaster/quick-auth';

const client = createClient();

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];
    
    // Verify the JWT token
    const payload = await client.verifyJwt({
      token,
      domain: request.headers.get('host') || 'localhost',
    });

    const { text, parentHash } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Cast text is required' }, { status: 400 });
    }

    if (text.length > 320) {
      return NextResponse.json({ error: 'Cast text cannot exceed 320 characters' }, { status: 400 });
    }

    // For now, we'll use the Farcaster Hub API directly
    // In a production app, you'd integrate with Neynar or another service
    const farcasterResponse = await fetch('https://api.farcaster.xyz/v2/casts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        ...(parentHash && { parent: { hash: parentHash } }),
      }),
    });

    if (!farcasterResponse.ok) {
      const errorText = await farcasterResponse.text();
      console.error('Farcaster API error:', errorText);
      return NextResponse.json({ error: 'Failed to post cast to Farcaster' }, { status: 500 });
    }

    const result = await farcasterResponse.json();

    return NextResponse.json({
      success: true,
      hash: result.cast.hash,
      message: 'Cast published successfully'
    });

  } catch (error) {
    console.error('Error in /api/farcaster/post-cast:', error);
    return NextResponse.json({ error: 'Failed to post cast' }, { status: 500 });
  }
} 