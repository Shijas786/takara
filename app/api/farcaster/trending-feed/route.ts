import { NextRequest, NextResponse } from 'next/server';
import { neynarHelpers } from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    const feedData = await neynarHelpers.getTrendingFeed(parseInt(limit));

    return NextResponse.json({
      success: true,
      feed: feedData.casts || [],
      message: 'Trending feed fetched successfully',
    });

  } catch (error) {
    console.error('Get trending feed error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 