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

    const response = await fetch(`https://api.neynar.com/v2/farcaster/casts?fid=${fid}&limit=10`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEYNAR_API_KEY || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Neynar API error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch casts' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const casts = data.casts || [];

    const formattedCasts = casts.map((cast: any) => ({
      hash: cast.hash,
      text: cast.text,
      timestamp: cast.timestamp,
      author: {
        username: cast.author.username,
        displayName: cast.author.display_name,
        pfp: cast.author.pfp_url,
      },
    }));

    return NextResponse.json({
      success: true,
      casts: formattedCasts,
    });

  } catch (error) {
    console.error('Casts fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 