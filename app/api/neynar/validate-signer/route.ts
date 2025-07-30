import { NextRequest, NextResponse } from 'next/server';
import { neynarService } from '../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const signerUuid = searchParams.get('signer_uuid');

    if (!signerUuid) {
      return NextResponse.json(
        { error: 'Signer UUID is required' },
        { status: 400 }
      );
    }

    // Validate the signer using Neynar service
    const signerData = await neynarService.validateSigner(signerUuid);

    return NextResponse.json({
      success: true,
      signer: signerData.signer,
    });

  } catch (error) {
    console.error('Error validating signer:', error);
    return NextResponse.json(
      { error: 'Failed to validate signer' },
      { status: 500 }
    );
  }
} 