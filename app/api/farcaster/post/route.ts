import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, signer_uuid } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!signer_uuid) {
      return NextResponse.json(
        { success: false, error: 'Signer UUID is required' },
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

    // First, verify the signer is approved
    const signerCheckResponse = await fetch(`https://api.neynar.com/v2/farcaster/signer/?signer_uuid=${signer_uuid}`, {
      method: 'GET',
      headers: {
        'x-api-key': neynarApiKey,
      },
    });

    if (!signerCheckResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired signer' },
        { status: 400 }
      );
    }

    const signerData = await signerCheckResponse.json();
    
    if (signerData.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: `Signer not approved. Current status: ${signerData.status}` },
        { status: 400 }
      );
    }
    
    console.log('Posting cast with user signer UUID:', signer_uuid);
    console.log('Cast text:', text);

    // Post the cast using the user's signer
    const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': neynarApiKey,
      },
      body: JSON.stringify({
        signer_uuid: signer_uuid,
        text: text,
      }),
    });

    console.log('Cast response status:', castResponse.status);

    if (!castResponse.ok) {
      const errorData = await castResponse.text();
      console.error('Cast posting error:', errorData);
      console.error('Response status:', castResponse.status);
      console.error('Response headers:', Object.fromEntries(castResponse.headers.entries()));
      return NextResponse.json(
        { success: false, error: `Failed to post cast: ${castResponse.status} - ${errorData}` },
        { status: castResponse.status }
      );
    }

    const castData = await castResponse.json();
    console.log('Cast response data:', JSON.stringify(castData, null, 2));
    
    const cast = castData.cast;

    return NextResponse.json({
      success: true,
      cast: {
        hash: cast.hash,
        text: cast.text,
        timestamp: cast.timestamp,
        author: cast.author,
      },
      message: 'Cast posted successfully to your account!',
    });

  } catch (error) {
    console.error('Post cast error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 