import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, fid, signerUuid } = await request.json();

    if (!text || !fid) {
      return NextResponse.json(
        { success: false, error: 'Missing text or FID' },
        { status: 400 }
      );
    }

    if (text.length > 320) {
      return NextResponse.json(
        { success: false, error: 'Cast text must be 320 characters or less' },
        { status: 400 }
      );
    }

    const neynarApiKey = process.env.NEYNAR_API_KEY;
    if (!neynarApiKey) {
      return NextResponse.json(
        { success: false, error: 'NEYNAR_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('Posting cast with Neynar API:', { text, fid, signerUuid });

    if (!signerUuid) {
      return NextResponse.json(
        { success: false, error: 'Signer UUID is required for posting' },
        { status: 400 }
      );
    }

    // Real Neynar API call to publish cast
    const response = await fetch(`https://api.neynar.com/v2/farcaster/cast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': neynarApiKey,
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        text: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Neynar API error:', response.status, errorData);
      return NextResponse.json(
        { success: false, error: `Neynar API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Cast posted successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Cast published successfully!',
      hash: data.cast?.hash || 'unknown',
      cast: data.cast || {
        hash: 'unknown',
        text: text,
        timestamp: new Date().toISOString(),
        author: {
          fid: fid,
          username: 'user',
          displayName: 'User'
        }
      }
    });

  } catch (error) {
    console.error('Farcaster post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post to Farcaster' },
      { status: 500 }
    );
  }
} 