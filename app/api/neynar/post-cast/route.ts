import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

const neynarClient = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY || ''
});

export async function POST(request: NextRequest) {
  try {
    const { text, signerUuid } = await request.json();

    if (!text || !signerUuid) {
      return NextResponse.json(
        sanitizeResponse({ error: 'Missing text or signerUuid' }),
        { status: 400 }
      );
    }

    if (!process.env.NEYNAR_API_KEY) {
      return NextResponse.json(
        sanitizeResponse({ error: 'Neynar API key not configured' }),
        { status: 500 }
      );
    }

    // Publish the cast using Neynar API
    const response = await neynarClient.publishCast({
      signerUuid,
      text,
    });

    return NextResponse.json(
      sanitizeResponse({
        success: true,
        cast: response.cast,
        message: 'Cast published successfully'
      })
    );

  } catch (error) {
    console.error('Error publishing cast:', error);
    
    return NextResponse.json(
      sanitizeResponse({ 
        error: 'Failed to publish cast',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
} 