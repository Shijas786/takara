import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: {
      version: "1",
      name: "Takara Content Evolution",
      description: "AI-powered content creation and Farcaster posting with Matrix Rain aesthetics",
      iconUrl: "https://takara-content-app.vercel.app/takara-logo.png",
      homeUrl: "https://takara-content-app.vercel.app",
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
    baseBuilder: {
      allowedAddresses: ["0x597c0A3b75d2BB4Ad9360FDec96b3b53B1BA9a0a"]
    },
  };

  return NextResponse.json(manifest);
}

