import { NextRequest, NextResponse } from 'next/server';
import { neynarHelpers } from '../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const limit = searchParams.get('limit') || '10';

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'FID is required' },
        { status: 400 }
      );
    }

    const castsData = await neynarHelpers.getUserCasts(parseInt(fid), parseInt(limit));

    return NextResponse.json({
      success: true,
      casts: castsData.casts || [],
      message: 'User casts fetched successfully',
    });

  } catch (error) {
    console.error('Get user casts error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 