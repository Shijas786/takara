import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    miniApp: {
      name: "Takara Content Evolution",
      description: "AI-powered content creation and Farcaster posting with Matrix Rain aesthetics",
      icon: "https://yourdomain.com/takara-logo.png", // Update with your actual domain
      url: "https://yourdomain.com", // Update with your actual domain
      noindex: false, // Set to true while testing
      category: "productivity",
      tags: ["ai", "content", "farcaster", "base", "onchain"],
      permissions: ["farcaster"],
      features: {
        farcaster: {
          posting: true,
          frames: true,
        },
        base: {
          wallet: true,
          transactions: false,
        },
      },
    },
  };

  return NextResponse.json(manifest);
}

