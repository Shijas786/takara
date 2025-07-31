import { NextRequest, NextResponse } from 'next/server';
import { neynarHelpers } from '../../../../lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address parameter is required'
        },
        { status: 400 }
      );
    }

    const result = await neynarHelpers.getUserByAddress(address);
    
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