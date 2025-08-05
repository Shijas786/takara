import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '../../../../lib/neynar';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

// GET: Fetch user signers (Step 5)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    
    if (!fid) {
      return NextResponse.json(
        sanitizeResponse({ error: 'FID is required' }),
        { status: 400 }
      );
    }

    const client = getNeynarClient();
    const response = await client.getSignersForUser({ fid: parseInt(fid) });
    
    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('Error fetching signers:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to fetch signers' }),
      { status: 500 }
    );
  }
} 