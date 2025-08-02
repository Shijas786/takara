import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt') || '';

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Takara Content Evolution</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://takara-content-evolution.vercel.app/api/og?prompt=${encodeURIComponent(prompt)}" />
        <meta property="fc:frame:button:1" content="Generate Content" />
        <meta property="fc:frame:button:2" content="Schedule Post" />
        <meta property="fc:frame:post_url" content="https://takara-content-evolution.vercel.app/api/frame/action" />
      </head>
      <body>
        <h1>Takara Content Evolution</h1>
        <p>AI-powered content generation for Farcaster</p>
      </body>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 