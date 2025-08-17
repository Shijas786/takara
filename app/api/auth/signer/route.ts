import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '../../../../lib/neynar';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export const dynamic = 'force-dynamic';

// GET: Check signer status (Step 9)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const signerUuid = searchParams.get('signerUuid');
    
    if (!signerUuid) {
      return NextResponse.json(
        sanitizeResponse({ error: 'signerUuid is required' }),
        { status: 400 }
      );
    }

    const client = getNeynarClient();
    const signer = await client.lookupSigner({ signerUuid });
    
    return NextResponse.json(sanitizeResponse(signer));
  } catch (error) {
    console.error('Error fetching signer status:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to fetch signer status' }),
      { status: 500 }
    );
  }
}

// POST: Create new signer (Step 7)
export async function POST(request: NextRequest) {
  try {
    const client = getNeynarClient();
    const response = await client.createSigner();
    
    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('Error creating signer:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to create signer' }),
      { status: 500 }
    );
  }
} 