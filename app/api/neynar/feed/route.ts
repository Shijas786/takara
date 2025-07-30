import { NextRequest, NextResponse } from 'next/server';
import neynarService from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending';
    const limit = parseInt(searchParams.get('limit') || '25');
    const channelId = searchParams.get('channelId');

    // Check if Neynar API key is configured
    if (!neynarService['apiKey'] || neynarService['apiKey'] === 'placeholder_neynar_key') {
      return NextResponse.json(
        {
          success: false,
          error: 'Neynar API key not configured. Please add NEYNAR_API_KEY to your environment variables.'
        },
        { status: 400 }
      );
    }

    let result;
    if (type === 'channel' && channelId) {
      result = await neynarService.getChannelFeed(channelId, limit);
    } else {
      result = await neynarService.getTrendingFeed(limit);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Feed data retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error fetching feed data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch feed data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 