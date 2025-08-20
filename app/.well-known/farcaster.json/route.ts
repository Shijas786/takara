import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
          header: "eyJmaWQiOjI1OTkxMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDlmZjdjNTNhNDU3NzcxOGQwOUIxYkZiYTVlRkU2MzFCOTlmY2FmZmMifQ",
    payload: "eyJkb21haW4iOiJ0YWthcmEtY29udGVudC1hcHAudmVyY2VsLmFwcCJ9",
    signature: "MHg2NDkyZWEzN2NiZTRkN2Q2ODc5NTFmMTZmMTM2OGZkODc1YmNlMzViYjhlYTdjMGIwOGYzMDExMmQxOThiN2EyNmNlNWFjOWI1MTY3YTRlN2Q5YTMyOTAzM2Q5YzhkMTMyZDYwMmFmZGJhZGUxN2JmY2IwZWY1ODI0MTkyZWM0YTFj",
    },
    miniapp: {
      version: "1",
      name: "Takara – Web3's AI content engine",
      description: "Turn raw ideas into viral-ready Web3 content. Takara gives creators AI-crafted posts that resonate.",
      iconUrl: "https://takara-content-app.vercel.app/takara-logo.png",
      homeUrl: "https://takara-content-app.vercel.app",
      imageUrl: "https://takara-content-app.vercel.app/takara-logo.png",
      buttonTitle: "🚀 Launch",
      splashImageUrl: "https://takara-content-app.vercel.app/takara-logo.png",
      splashBackgroundColor: "#000000",
      category: "productivity",
      tags: ["ai", "content", "farcaster", "base", "onchain", "web3", "creator"],
      requiredCapabilities: [
        "actions.composeCast",
        "wallet.getEthereumProvider"
      ]
    },
    baseBuilder: {
      allowedAddresses: ["0x597c0A3b75d2BB4Ad9360FDec96b3b53B1BA9a0a"]
    },
  };

  return NextResponse.json(manifest);
}

