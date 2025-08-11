import { NextRequest, NextResponse } from 'next/server';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trustedData, untrustedData } = body;
    
    if (!trustedData) {
      return NextResponse.json(sanitizeResponse({ error: 'Invalid request' }), { status: 400 });
    }

    const { messageBytes } = trustedData;
    const buttonIndex = untrustedData?.buttonIndex || 1;
    const prompt = untrustedData?.inputText || '';

    let responseText = '';
    const appUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://takara-content-app.vercel.app';

    if (buttonIndex === 1) {
      responseText = `🎯 Content generated for: "${prompt}"

Visit ${appUrl} to see your evolved content!`;
    } else if (buttonIndex === 2) {
      responseText = `📅 Post scheduled for: "${prompt}"

Check your scheduled posts at ${appUrl}/scheduled`;
    }

    return NextResponse.json(sanitizeResponse({
      frames: [{
        text: responseText
      }]
    }));

  } catch (error) {
    console.error('Frame action error:', error);
    return NextResponse.json(sanitizeResponse({ error: 'Failed to process frame action' }), { status: 500 });
  }
} 