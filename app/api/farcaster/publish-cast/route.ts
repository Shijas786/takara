import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, signerUuid, parentUrl, channelId } = body;

    if (!text || !signerUuid) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: text and signerUuid' },
        { status: 400 }
      );
    }

    // Demo cast publishing
    const demoCast = {
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
      thread_hash: null,
      parent_hash: parentUrl ? `0x${Math.random().toString(16).substring(2, 10)}` : null,
      author: {
        fid: 12345,
        username: 'demo_user',
        display_name: 'Demo User',
        pfp_url: 'https://picsum.photos/200',
      },
      text: text,
      timestamp: new Date().toISOString(),
      reactions: {
        likes: 0,
        recasts: 0,
        replies: 0,
      },
      replies: {
        count: 0,
      },
      recasts: {
        count: 0,
      },
      likes: {
        count: 0,
      },
      channel: channelId ? { id: channelId, name: channelId } : null,
    };

    return NextResponse.json({
      success: true,
      cast: demoCast,
      message: 'Demo cast published successfully!'
    });

  } catch (error: any) {
    console.error('Publish cast error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish cast',
        details: error
      },
      { status: 500 }
    );
  }
} 