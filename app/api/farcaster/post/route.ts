import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
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

    // For mini apps, we'll use a default signer since the user is already authenticated
    // In a real implementation, you'd get the user's signer from the mini app context
    const defaultSignerUuid = '5dfa0879-260d-46bc-8cb8-f8befb72bc75';
    
    console.log('Posting cast with signer UUID:', defaultSignerUuid);
    console.log('Cast text:', text);

    // Post the cast using the signer
    const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': neynarApiKey,
      },
      body: JSON.stringify({
        signer_uuid: defaultSignerUuid,
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
      },
      message: 'Cast posted successfully!',
    });

  } catch (error) {
    console.error('Post cast error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 