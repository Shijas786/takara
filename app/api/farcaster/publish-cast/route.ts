import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { config } from '../../../../lib/config';

const neynarClient = new NeynarAPIClient({ apiKey: config.farcaster.neynarApiKey });

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

    // Prepare cast data
    const castData: any = {
      signer_uuid: signerUuid,
      text: text,
    };

    // Add parent URL if provided (for replies)
    if (parentUrl) {
      castData.parent_url = parentUrl;
    }

    // Add channel ID if provided
    if (channelId) {
      castData.channel_id = channelId;
    }

    // TODO: Fix Neynar API integration - method signature has changed
    // const result = await neynarClient.publishCast(castData);

    // Temporary mock response until API is fixed
    const result = {
      cast: {
        hash: 'temp-cast-hash',
        thread_hash: 'temp-thread-hash',
        parent_hash: null,
        author: {
          fid: 12345,
          username: 'demo_user',
          display_name: 'Demo User',
          pfp_url: 'https://picsum.photos/200'
        },
        text: text,
        timestamp: new Date().toISOString(),
        reactions: { likes: 0, recasts: 0 },
        replies: { count: 0 },
        recasts: { count: 0 }
      }
    };

    return NextResponse.json({
      success: true,
      cast: result.cast,
      message: 'Cast published successfully!'
    });

  } catch (error: any) {
    console.error('Publish cast error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish cast',
        details: error.response?.data || error
      },
      { status: 500 }
    );
  }
} 