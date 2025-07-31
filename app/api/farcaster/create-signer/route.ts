import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const neynarApiKey = process.env.NEYNAR_API_KEY;
    if (!neynarApiKey) {
      return NextResponse.json(
        { success: false, error: 'NEYNAR_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Create a new signer for the user
    const signerResponse = await fetch('https://api.neynar.com/v2/farcaster/signer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': neynarApiKey,
      },
      body: JSON.stringify({
        // Optional: You can specify a name for the signer
        name: 'KAI Content Evolution Signer',
      }),
    });

    if (!signerResponse.ok) {
      const errorData = await signerResponse.text();
      console.error('Signer creation error:', errorData);
      return NextResponse.json(
        { success: false, error: `Failed to create signer: ${signerResponse.status} - ${errorData}` },
        { status: signerResponse.status }
      );
    }

    const signerData = await signerResponse.json();
    console.log('Signer created:', signerData);

    return NextResponse.json({
      success: true,
      signer: {
        signer_uuid: signerData.signer_uuid,
        signer_approval_url: signerData.signer_approval_url,
        status: signerData.status,
        public_key: signerData.public_key,
      },
      message: 'Signer created successfully. Please approve it using the approval URL.',
    });

  } catch (error) {
    console.error('Create signer error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 