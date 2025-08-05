import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '../../../../lib/neynar';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export async function GET(request: NextRequest) {
  try {
    const client = getNeynarClient();
    const response = await client.fetchNonce();
    
    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to fetch nonce' }),
      { status: 500 }
    );
  }
} 