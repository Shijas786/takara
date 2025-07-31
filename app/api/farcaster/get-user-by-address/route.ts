import { NextRequest, NextResponse } from 'next/server';
import { neynarHelpers } from '../../../../lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Ethereum address is required' },
        { status: 400 }
      );
    }

    // Use the new Neynar helpers
    const userData = await neynarHelpers.getUserByAddress(address);
    console.log('User data:', userData);

    if (!userData.users || userData.users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'NO_USER_FOUND',
        message: 'No Farcaster user found for this Ethereum address',
      });
    }

    const user = userData.users[0];

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp_url,
        custodyAddress: user.custody_address,
        followerCount: user.follower_count,
        followingCount: user.following_count,
        verifications: user.verifications,
        activeStatus: user.active_status,
      },
      message: 'Farcaster user found successfully',
    });

  } catch (error) {
    console.error('Get user by address error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 