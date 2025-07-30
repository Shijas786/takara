import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'generate') {
      // Generate QR code for Farcaster login
      console.log('Generating QR code with API key:', process.env.NEYNAR_API_KEY ? 'Present' : 'Missing');
      
      const response = await fetch('https://api.neynar.com/v2/farcaster/signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEYNAR_API_KEY || '',
        },
        body: JSON.stringify({
          // This will create a signer that can be used for QR authentication
          signer_uuid: `kai-${Date.now()}`,
          app_fid: 1, // Add app_fid parameter
        }),
      });

      console.log('Neynar API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('QR generation error:', errorData);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        return NextResponse.json(
          { success: false, error: `Failed to generate QR code: ${response.status} - ${errorData}` },
          { status: 500 }
        );
      }

      const data = await response.json();
      console.log('Neynar API response data:', JSON.stringify(data, null, 2));
      
      if (!data.signer || !data.signer.signer_approval_url) {
        console.error('Invalid response format:', data);
        return NextResponse.json(
          { success: false, error: 'Invalid response format from Neynar API' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        signer_uuid: data.signer.signer_uuid,
        qr_code: data.signer.signer_approval_url,
        expires_in: 300, // 5 minutes
      });

    } else if (action === 'check') {
      const { signer_uuid } = await request.json();

      if (!signer_uuid) {
        return NextResponse.json(
          { success: false, error: 'Signer UUID is required' },
          { status: 400 }
        );
      }

      // Check if the signer has been approved
      const response = await fetch(`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${signer_uuid}`, {
        headers: {
          'x-api-key': process.env.NEYNAR_API_KEY || '',
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'Failed to check signer status' },
          { status: 500 }
        );
      }

      const data = await response.json();
      const signer = data.signer;

      if (signer.status === 'approved') {
        // Get user information
        const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user?fid=${signer.fid}`, {
          headers: {
            'x-api-key': process.env.NEYNAR_API_KEY || '',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.user;

          return NextResponse.json({
            success: true,
            approved: true,
            user: {
              fid: user.fid,
              username: user.username,
              displayName: user.display_name,
              pfp: user.pfp_url,
            },
            signer_uuid: signer_uuid,
          });
        }
      }

      return NextResponse.json({
        success: true,
        approved: false,
        status: signer.status,
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('QR login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 