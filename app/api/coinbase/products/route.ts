import { NextRequest, NextResponse } from 'next/server';
import coinbaseService from '../../../../lib/coinbase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      const product = await coinbaseService.getProduct(productId);
      return NextResponse.json({
        success: true,
        data: product
      });
    } else {
      const products = await coinbaseService.getProducts();
      return NextResponse.json({
        success: true,
        data: products
      });
    }
  } catch (error) {
    console.error('Error fetching Coinbase products:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Coinbase products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 