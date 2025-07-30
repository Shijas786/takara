import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, signer_uuid } = await request.json();

    if (!prompt || !signer_uuid) {
      return NextResponse.json(
        { error: 'Prompt and signer_uuid are required' },
        { status: 400 }
      );
    }

    // Step 1: Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a crypto Twitter expert who creates viral, engaging content in CT (Crypto Twitter) slang. Generate funny, witty, and engaging posts that would perform well on Farcaster. Keep it under 280 characters and use relevant emojis. Make it authentic and entertaining."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      );
    }

    // Ensure the generated text doesn't exceed Farcaster's limit
    const truncatedText = generatedText.length > 320 ? generatedText.substring(0, 317) + '...' : generatedText;

    // Step 2: Post to Farcaster using Neynar
    const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': process.env.NEYNAR_API_KEY || '',
      },
      body: JSON.stringify({
        signer_uuid: signer_uuid,
        text: truncatedText,
      }),
    });

    if (!castResponse.ok) {
      const errorData = await castResponse.text();
      console.error('Neynar cast posting failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to post to Farcaster' },
        { status: 500 }
      );
    }

    const castData = await castResponse.json();
    const cast = castData.cast;

    // Construct the Warpcast URL
    const castUrl = `https://warpcast.com/${cast.author.username}/${cast.hash}`;

    return NextResponse.json({
      success: true,
      generated_text: truncatedText,
      cast_hash: cast.hash,
      cast_url: castUrl,
      message: 'Content generated and posted successfully!',
    });

  } catch (error) {
    console.error('Post cast error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 