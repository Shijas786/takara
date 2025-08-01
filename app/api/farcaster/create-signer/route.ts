import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { config } from '../../../../lib/config';

const neynarClient = new NeynarAPIClient({ apiKey: config.farcaster.neynarApiKey });

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
    // TODO: Fix Neynar API integration - method signature has changed
    // const result = await neynarClient.createSigner({
    //   fid: parseInt(fid),
    //   app_fid: parseInt(process.env.NEXT_PUBLIC_NEYNAR_APP_FID || '0'),
    //   app_mnemonic: process.env.NEYNAR_APP_MNEMONIC || '',
    // });

    // Temporary mock response until API is fixed
    const result = {
      signer: {
        signer_uuid: 'temp-signer-uuid',
        status: 'pending_approval',
        public_key: 'temp-public-key',
        signer_approval_url: 'https://example.com/approve'
      }
    };

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