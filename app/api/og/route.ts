import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt') || 'AI Content Evolution';

  // Create a simple SVG image for the Frame
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)"/>
      <text x="600" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
        Takara Content Evolution
      </text>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white">
        AI-Powered Content Generation
      </text>
      <text x="600" y="400" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white" opacity="0.8">
        "${prompt}"
      </text>
      <text x="600" y="550" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white" opacity="0.6">
        Generate • Schedule • Evolve
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
} 