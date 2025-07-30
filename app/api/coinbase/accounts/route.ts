import { NextRequest, NextResponse } from 'next/server';
import coinbaseService from '../../../../lib/coinbase';

export async function GET(request: NextRequest) {
  try {
    const accounts = await coinbaseService.getAccounts();
    
    return NextResponse.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Error fetching Coinbase accounts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Coinbase accounts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 