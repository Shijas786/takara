import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    "accountAssociation": {
      "signature": "YOUR_SIGNATURE_HERE",
      "signer": "YOUR_SIGNER_ADDRESS_HERE",
      "timestamp": 0,
      "domain": "takara-content-app.vercel.app"
    },
    "frame": {
      "name": "TAKARA Content Evolution",
      "version": "1.0.0",
      "description": "Transform your ideas into viral Farcaster content with AI-powered evolution. TAKARA analyzes your thoughts and reworks them using authentic styles from top crypto influencers. Whether you need a sharp quote, spicy reply, or viral CTA, TAKARA evolves your words for maximum impact. Built for the Farcaster community, by the community.",
      "iconUrl": "https://takara-content-app.vercel.app/takara-logo.png",
      "homeUrl": "https://takara-content-app.vercel.app/",
      "imageUrl": "https://takara-content-app.vercel.app/og-image.png",
      "buttonTitle": "🚀 Evolve Content",
      "splashImageUrl": "https://takara-content-app.vercel.app/takara-logo.png",
      "splashBackgroundColor": "#1e293b",
      "webhookUrl": "https://takara-content-app.vercel.app/api/webhook",
      "permissions": [
        "farcaster",
        "farcaster_write"
      ]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 