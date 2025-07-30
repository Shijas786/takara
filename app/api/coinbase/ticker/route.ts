import { NextRequest, NextResponse } from 'next/server';
import coinbaseService from '../../../../lib/coinbase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required'
        },
        { status: 400 }
      );
    }
    
    const ticker = await coinbaseService.getProductTicker(productId);
    
    return NextResponse.json({
      success: true,
      data: ticker
    });
  } catch (error) {
    console.error('Error fetching Coinbase ticker:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Coinbase ticker',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 