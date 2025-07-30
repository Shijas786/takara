import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../../lib/config';

export async function GET(request: NextRequest) {
  try {
    if (!config.supabase.url || !config.supabase.anonKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase configuration not complete'
        },
        { status: 400 }
      );
    }

    // Test Supabase connection by making a simple query
    const response = await fetch(`${config.supabase.url}/rest/v1/`, {
      headers: {
        'apikey': config.supabase.anonKey,
        'Authorization': `Bearer ${config.supabase.anonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase connection failed',
          status: response.status
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: {
        url: config.supabase.url,
        status: 'connected'
      }
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Supabase test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 