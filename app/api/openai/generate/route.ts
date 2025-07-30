import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '../../../lib/openai';
import { Influencer } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      style, 
      length, 
      influencerId,
      mixedInfluencerId 
    } = body;

    // Create a mock influencer for the AI service
    const mockInfluencer: Influencer = {
      id: influencerId || 'kai',
      name: 'Kai Evolution',
      handle: 'kai_evolution',
      avatar: '',
      description: 'AI-powered content evolution tool',
      style: style || 'crypto',
      followers: 0,
      category: 'crypto' as const,
      sampleTweets: [],
    };

    const openaiService = new OpenAIService();
    
    const generatedContent = await openaiService.generateShitpost(
      {
        influencerId: influencerId || 'kai',
        mixedInfluencerId,
        prompt,
        style: style || 'crypto',
        length: length || 'medium',
      },
      mockInfluencer
    );

    return NextResponse.json({ 
      success: true, 
      content: generatedContent 
    });
  } catch (error: any) {
    console.error('OpenAI generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate content' 
      },
      { status: 500 }
    );
  }
} 