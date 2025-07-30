import { NextRequest, NextResponse } from 'next/server';
import neynarService from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const limit = parseInt(searchParams.get('limit') || '25');

    if (!fid) {
      return NextResponse.json(
        {
          success: false,
          error: 'FID parameter is required'
        },
        { status: 400 }
      );
    }

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

    const result = await neynarService.getUserCasts(parseInt(fid), limit);
    
    return NextResponse.json({
      success: true,
      message: 'User casts retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error fetching user casts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user casts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 