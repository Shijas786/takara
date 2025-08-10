import { NextRequest, NextResponse } from 'next/server';
import { sanitizeResponse } from '../../../lib/sanitizeResponse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    console.log('MiniKit webhook received:', body);
    return NextResponse.json(sanitizeResponse({ ok: true }));
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(sanitizeResponse({ ok: false }), { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}