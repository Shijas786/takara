import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@farcaster/quick-auth';

const client = createClient();

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];
    
    // Verify the JWT token
    const payload = await client.verifyJwt({
      token,
      domain: request.headers.get('host') || 'localhost',
    });

    // Get user's primary address
    const primaryAddressResponse = await fetch(
      `https://api.farcaster.xyz/fc/primary-address?fid=${payload.sub}&protocol=ethereum`
    );

    let primaryAddress: string | undefined;
    if (primaryAddressResponse.ok) {
      const { result } = await primaryAddressResponse.json();
      primaryAddress = result.address.address;
    }

    const user = {
      fid: payload.sub,
      primaryAddress,
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in /api/farcaster/me:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
} 