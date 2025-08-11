import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || 'Check out this amazing content!';
  const origin = new URL(request.url).origin;
  const appUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || origin;
  const frameImage = process.env.NEXT_PUBLIC_FRAME_IMAGE_URL || `${appUrl}/api/og?prompt=Takara`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Takara Content Evolution</title>
        <meta property="og:title" content="Takara Content Evolution" />
        <meta property="og:description" content="AI-powered content creation for Farcaster" />
        <meta property="og:image" content="${frameImage}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:button:1" content="Open Takara" />
        <meta property="fc:frame:post_url" content="${appUrl}/frame" />
      </head>
      <body>
        <h1>Takara Content Evolution</h1>
        <p>AI-powered content creation for Farcaster</p>
        <p>Generated content: ${text}</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const frameImage = process.env.NEXT_PUBLIC_FRAME_IMAGE_URL || `${appUrl}/api/og?prompt=Takara`;

  return NextResponse.json({
    version: 'vNext',
    image: frameImage,
    buttons: ['Open Takara'],
    post_url: `${appUrl}/frame`,
  });
} 