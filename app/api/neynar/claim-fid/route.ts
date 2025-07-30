import { NextRequest, NextResponse } from 'next/server';
import neynarService from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const username = searchParams.get('username');
    const address = searchParams.get('address');

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
    if (fid) {
      result = await neynarService.getUserByFid(parseInt(fid));
    } else if (username) {
      result = await neynarService.getUserByUsername(username);
    } else if (address) {
      result = await neynarService.getUserByWalletAddress(address);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide either fid, username, or address parameter'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User data retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 