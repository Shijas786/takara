import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { signer_uuid } = await request.json();

    if (!signer_uuid) {
      return NextResponse.json(
        { success: false, error: 'Signer UUID is required' },
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

    // Check signer status using Neynar API
    const signerResponse = await fetch(`https://api.neynar.com/v2/farcaster/signer/?signer_uuid=${signer_uuid}`, {
      method: 'GET',
      headers: {
        'x-api-key': neynarApiKey,
      },
    });

    if (!signerResponse.ok) {
      const errorData = await signerResponse.text();
      console.error('Signer status check error:', errorData);
      return NextResponse.json(
        { success: false, error: `Failed to check signer status: ${signerResponse.status} - ${errorData}` },
        { status: signerResponse.status }
      );
    }

    const signerData = await signerResponse.json();
    console.log('Signer status:', signerData);

    return NextResponse.json({
      success: true,
      signer: {
        signer_uuid: signerData.signer_uuid,
        status: signerData.status,
        fid: signerData.fid,
        public_key: signerData.public_key,
        permissions: signerData.permissions,
      },
      approved: signerData.status === 'approved',
      message: signerData.status === 'approved' 
        ? 'Signer is approved and ready to use!' 
        : `Signer status: ${signerData.status}`,
    });

  } catch (error) {
    console.error('Check signer error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 