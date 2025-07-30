import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '../../../../lib/openai';
import { Influencer } from '../../../../types';

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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate content';
    let statusCode = 500;
    
    if (error.message?.includes('API key not configured')) {
      errorMessage = 'OpenAI API key not configured. Please add your OpenAI API key to the .env.local file. See API_KEYS_SETUP.md for instructions.';
      statusCode = 401;
    } else if (error.message?.includes('401') || error.message?.includes('AuthenticationError')) {
      errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
      statusCode = 401;
    } else if (error.message?.includes('404') || error.message?.includes('does not exist')) {
      errorMessage = 'Model access issue. Please check your OpenAI subscription and try again.';
      statusCode = 404;
    } else if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RateLimit')) {
      errorMessage = 'Rate limit reached. Please wait a moment and try again, or check your OpenAI billing.';
      statusCode = 429;
    } else {
      errorMessage = error.message || 'Failed to generate content';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: statusCode }
    );
  }
} 