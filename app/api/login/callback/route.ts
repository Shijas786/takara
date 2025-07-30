import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=oauth_failed`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=missing_params`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://neynar.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.NEYNAR_CLIENT_ID || '',
        client_secret: process.env.NEYNAR_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/login/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user information using the access token
    const userResponse = await fetch('https://api.neynar.com/v2/farcaster/user/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'api_key': process.env.NEYNAR_API_KEY || '',
      },
    });

    if (!userResponse.ok) {
      console.error('User info fetch failed:', await userResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=user_fetch_failed`);
    }

    const userData = await userResponse.json();
    const user = userData.user;

    // Get user's signers
    const signersResponse = await fetch(`https://api.neynar.com/v2/farcaster/signer?fid=${user.fid}`, {
      headers: {
        'api_key': process.env.NEYNAR_API_KEY || '',
      },
    });

    if (!signersResponse.ok) {
      console.error('Signers fetch failed:', await signersResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=signers_fetch_failed`);
    }

    const signersData = await signersResponse.json();
    const signers = signersData.signers || [];

    if (signers.length === 0) {
      // Create a new signer if none exist
      const createSignerResponse = await fetch('https://api.neynar.com/v2/farcaster/signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY || '',
        },
        body: JSON.stringify({
          fid: user.fid,
        }),
      });

      if (!createSignerResponse.ok) {
        console.error('Signer creation failed:', await createSignerResponse.text());
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=signer_creation_failed`);
      }

      const newSignerData = await createSignerResponse.json();
      const signerUuid = newSignerData.signer.signer_uuid;

      // Store user data and signer UUID in cookies
      const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?login=success`);
      
      response.cookies.set('farcaster_user', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      response.cookies.set('farcaster_signer_uuid', signerUuid, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } else {
      // Use the first available signer
      const signerUuid = signers[0].signer_uuid;

      // Store user data and signer UUID in cookies
      const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?login=success`);
      
      response.cookies.set('farcaster_user', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      response.cookies.set('farcaster_signer_uuid', signerUuid, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?error=callback_failed`);
  }
} 