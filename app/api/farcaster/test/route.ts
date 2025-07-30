import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../../lib/config';

export async function GET(request: NextRequest) {
  try {
    if (!config.farcaster.apiKey || config.farcaster.apiKey === 'placeholder_farcaster_key') {
      return NextResponse.json(
        {
          success: false,
          error: 'Farcaster API key not configured'
        },
        { status: 400 }
      );
    }

    // Test Farcaster API by fetching user info
    const response = await fetch(`${config.farcaster.baseUrl}/user`, {
      headers: {
        'Authorization': `Bearer ${config.farcaster.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: 'Farcaster API request failed',
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Farcaster API connection successful',
      data: {
        user: data.data?.user,
        apiVersion: 'v2'
      }
    });
  } catch (error) {
    console.error('Farcaster test error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Farcaster API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 