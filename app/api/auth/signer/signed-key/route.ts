import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '../../../../../lib/neynar';
import { sanitizeResponse } from '../../../../../lib/sanitizeResponse';

// POST: Register signed key (Step 8)
export async function POST(request: NextRequest) {
  try {
    const { 
      signerUuid, 
      signature, 
      signedKeyRequest, 
      deadline, 
      requestFid 
    } = await request.json();

    if (!signerUuid || !signature || !signedKeyRequest || !deadline || !requestFid) {
      return NextResponse.json(
        sanitizeResponse({ error: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    const client = getNeynarClient();
    const response = await client.registerSignedKey({
      signerUuid,
      signature,
      deadline,
      requestFid,
    });
    
    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('Error registering signed key:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to register signed key' }),
      { status: 500 }
    );
  }
} 