import { NextRequest, NextResponse } from 'next/server';
import { neynarHelpers } from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (type === 'trending') {
      const response = await neynarHelpers.getTrendingFeed(limit);
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        { error: 'Invalid feed type. Only "trending" is supported.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Neynar feed API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed data' },
      { status: 500 }
    );
  }
} 