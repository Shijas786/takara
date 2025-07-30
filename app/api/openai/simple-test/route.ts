import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { config } from '../../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    console.log('API Key length:', config.openai.apiKey.length);
    console.log('API Key starts with:', config.openai.apiKey.substring(0, 10));
    
    const openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, this is a test!"',
        },
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content || 'No response';

    return NextResponse.json({ 
      success: true, 
      response,
      apiKeyLength: config.openai.apiKey.length,
      apiKeyPrefix: config.openai.apiKey.substring(0, 10)
    });
  } catch (error: any) {
    console.error('Simple test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to test OpenAI',
        apiKeyLength: config.openai.apiKey.length,
        apiKeyPrefix: config.openai.apiKey.substring(0, 10)
      },
      { status: 500 }
    );
  }
} 