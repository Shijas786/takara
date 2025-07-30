import { NextRequest, NextResponse } from 'next/server';
import { neynarService } from '../../../lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json();

    if (!fid || typeof fid !== 'number') {
      return NextResponse.json(
        { error: 'Valid FID is required' },
        { status: 400 }
      );
    }

    // Create a new signer using Neynar service
    const signerData = await neynarService.createSigner(fid);

    return NextResponse.json({
      success: true,
      signer_uuid: signerData.signer.signer_uuid,
      sign_in_url: signerData.signer.sign_in_url,
      status: signerData.signer.status,
    });

  } catch (error) {
    console.error('Error creating signer:', error);
    return NextResponse.json(
      { error: 'Failed to create signer' },
      { status: 500 }
    );
  }
} 