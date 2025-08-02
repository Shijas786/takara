import { NextRequest, NextResponse } from 'next/server';
import { openaiService } from '../../../../lib/openai';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export async function GET(request: NextRequest) {
  try {
    const prompt = request.nextUrl.searchParams.get('prompt') || 'Hello, this is a test message from Takara Content Evolution.';
    const response = await openaiService.generateShitpost(
      { prompt, style: 'shitpost', length: 'short', influencerId: 'takara' },
      {
        id: 'takara',
        name: 'Takara Evolution',
        handle: 'takara_evolution',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        description: 'AI-powered content evolution platform for creators',
        style: 'shitpost',
        followers: 15000,
        category: 'tech',
        sampleTweets: [
          'Just evolved my content strategy with AI! 🚀',
          'The future of content creation is here 💡',
          'From idea to viral post in seconds ⚡'
        ]
      }
    );
    return NextResponse.json(sanitizeResponse({ content: response }));
  } catch (error) {
    return NextResponse.json(sanitizeResponse({ error: (error as Error).message }), { status: 500 });
  }
} 