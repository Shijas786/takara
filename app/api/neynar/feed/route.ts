import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '../../../../lib/neynar';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (type === 'trending') {
      const client = getNeynarClient();
      const response = await client.fetchTrendingFeed({
        limit,
        timeWindow: '24h'
      });
      return NextResponse.json(sanitizeResponse(response));
    } else {
      return NextResponse.json(
        sanitizeResponse({ error: 'Invalid feed type. Only "trending" is supported.' }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Neynar feed API error:', error);
    return NextResponse.json(
      sanitizeResponse({ error: 'Failed to fetch feed data' }),
      { status: 500 }
    );
  }
} 