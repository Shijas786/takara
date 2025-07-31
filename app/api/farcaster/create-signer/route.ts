import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { config } from '../../../../lib/config';

const neynarClient = new NeynarAPIClient(config.farcaster.neynarApiKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: fid' },
        { status: 400 }
      );
    }

    // Create a signer for the user
    const result = await neynarClient.createSigner({
      fid: parseInt(fid),
      app_fid: parseInt(process.env.NEXT_PUBLIC_NEYNAR_APP_FID || '0'),
      app_mnemonic: process.env.NEYNAR_APP_MNEMONIC || '',
    });

    return NextResponse.json({
      success: true,
      signer: result.signer,
      message: 'Signer created successfully!'
    });

  } catch (error: any) {
    console.error('Create signer error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create signer',
        details: error.response?.data || error
      },
      { status: 500 }
    );
  }
} 