import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'FID parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.neynar.com/v2/farcaster/user?fid=${fid}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEYNAR_API_KEY || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Neynar API error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const user = data.user;

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp_url,
        followerCount: user.follower_count,
        followingCount: user.following_count,
      },
    });

  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 