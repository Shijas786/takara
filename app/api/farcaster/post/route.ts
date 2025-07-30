import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fid, text } = await request.json();

    if (!fid || !text) {
      return NextResponse.json(
        { success: false, error: 'FID and text are required' },
        { status: 400 }
      );
    }

    if (text.length > 320) {
      return NextResponse.json(
        { success: false, error: 'Cast text must be 320 characters or less' },
        { status: 400 }
      );
    }

    // First, get the user's signers
    const signersResponse = await fetch(`https://api.neynar.com/v2/farcaster/signer?fid=${fid}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEYNAR_API_KEY || '',
      },
    });

    if (!signersResponse.ok) {
      const errorData = await signersResponse.text();
      console.error('Signers fetch error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user signers' },
        { status: signersResponse.status }
      );
    }

    const signersData = await signersResponse.json();
    const signers = signersData.signers || [];

    if (signers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No signers found for this user. Please create a signer first.' },
        { status: 400 }
      );
    }

    // Use the first available signer
    const signerUuid = signers[0].signer_uuid;

    // Post the cast
    const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEYNAR_API_KEY || '',
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        text: text,
      }),
    });

    if (!castResponse.ok) {
      const errorData = await castResponse.text();
      console.error('Cast posting error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to post cast' },
        { status: castResponse.status }
      );
    }

    const castData = await castResponse.json();
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