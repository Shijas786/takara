import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!config.openai.apiKey || config.openai.apiKey === 'placeholder_openai_key') {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key not configured'
        },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [
          {
            role: 'user',
            content: prompt || 'Hello, this is a test message from Takara Content Evolution.'
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API request failed',
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'OpenAI API connection successful',
      data: {
        model: data.model,
        usage: data.usage,
        response: data.choices[0]?.message?.content
      }
    });
  } catch (error) {
    console.error('OpenAI test error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'OpenAI API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 