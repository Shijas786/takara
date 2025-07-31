import { NextRequest, NextResponse } from 'next/server';

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

    // Demo signer creation
    const demoSigner = {
      signer_uuid: `demo-signer-${Date.now()}`,
      fid: parseInt(fid),
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      signer: demoSigner,
      message: 'Demo signer created successfully!'
    });

  } catch (error: any) {
    console.error('Create signer error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create signer',
        details: error
      },
      { status: 500 }
    );
  }
} 