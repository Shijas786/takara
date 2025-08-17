import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '../../../../lib/neynar';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export const dynamic = 'force-dynamic';

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

    // Depending on SDK version, the method to fetch signers can differ.
    // If not available, respond with a clear message for now.
    if (typeof (client as any).getSignersForUser !== 'function' && typeof (client as any).listSigners !== 'function') {
      return NextResponse.json(
        sanitizeResponse({ error: 'Listing signers is not supported by the current Neynar SDK version' }),
        { status: 501 }
      );
    }

    // Prefer new method name if present
    let response: any;
    if (typeof (client as any).listSigners === 'function') {
      response = await (client as any).listSigners({ fid: parseInt(fid) });
    } else {
      response = await (client as any).getSignersForUser({ fid: parseInt(fid) });
    }
    
    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('Error fetching signers:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to fetch signers' }),
      { status: 500 }
    );
  }
} 