import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Ethereum address is required' },
        { status: 400 }
      );
    }

    const neynarApiKey = process.env.NEYNAR_API_KEY;
    if (!neynarApiKey) {
      return NextResponse.json(
        { success: false, error: 'NEYNAR_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Fetch user information by Ethereum address using Neynar API
    const userResponse = await fetch('https://api.neynar.com/v2/farcaster/user/bulk-by-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': neynarApiKey,
      },
      body: JSON.stringify({
        addresses: [address],
      }),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('User fetch error:', errorData);
      return NextResponse.json(
        { success: false, error: `Failed to fetch user: ${userResponse.status} - ${errorData}` },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
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