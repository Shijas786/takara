import { NextRequest, NextResponse } from 'next/server';
import { neynarService } from '../../../lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const { signer_uuid, text, reply_to, channel_id } = await request.json();

    if (!signer_uuid || !text) {
      return NextResponse.json(
        { error: 'Signer UUID and text are required' },
        { status: 400 }
      );
    }

    if (text.length > 320) {
      return NextResponse.json(
        { error: 'Cast text exceeds 320 character limit' },
        { status: 400 }
      );
    }

    // Post the cast using Neynar service
    const castData = await neynarService.postCast(signer_uuid, text, reply_to, channel_id);

    return NextResponse.json({
      success: true,
      cast: castData.cast,
      message: 'Successfully posted to Farcaster!',
    });

  } catch (error) {
    console.error('Error posting cast:', error);
    return NextResponse.json(
      { error: 'Failed to post cast' },
      { status: 500 }
    );
  }
} 