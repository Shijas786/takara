import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    // Extract button index and other data
    const buttonIndex = untrustedData?.buttonIndex || 1;
    const inputText = untrustedData?.inputText || '';
    const fid = trustedData?.messageBytes?.verified?.fid;

    console.log('Frame action received:', { buttonIndex, inputText, fid });

    let responseContent = '';
    let imageUrl = '';

    if (buttonIndex === 1) {
      // Generate Content Button
      if (!inputText.trim()) {
        responseContent = 'Please provide a prompt for content generation. Example: "Write a tweet about AI"';
        imageUrl = 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png';
      } else {
        try {
          // Call your OpenAI API to generate content
          const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/openai/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: inputText.trim(),
              style: 'based',
              length: 'medium',
              tone: 'authentic',
            }),
          });

          const aiData = await aiResponse.json();
          
          if (aiData.success) {
            responseContent = `Generated Content:\n\n${aiData.content}\n\nClick "Post to Farcaster" to share it!`;
            imageUrl = 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png';
          } else {
            responseContent = 'Failed to generate content. Please try again.';
            imageUrl = 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png';
          }
        } catch (error) {
          console.error('AI generation error:', error);
          responseContent = 'Error generating content. Please try again.';
          imageUrl = 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png';
        }
      }
    } else if (buttonIndex === 2) {
      // Post to Farcaster Button
      if (!inputText.trim()) {
        responseContent = 'No content to post. Please generate content first using button 1.';
        imageUrl = 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png';
      } else {
        responseContent = 'Content ready for posting! Use the Takara Mini App in Farcaster for direct posting.';
        imageUrl = 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png';
      }
    }

    // Return Frame response
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: imageUrl,
        buttons: [
          {
            label: 'Generate Content',
            action: 'post',
          },
          {
            label: 'Post to Farcaster',
            action: 'post',
          },
        ],
        input: {
          text: 'Enter your content prompt here...',
        },
        post_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/frame/action`,
      },
      content: responseContent,
    });

  } catch (error) {
    console.error('Frame action error:', error);
    
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: 'https://takara-content-b5g6ni9xh-shijas-projects-45273324.vercel.app/takara-logo.png',
        buttons: [
          {
            label: 'Try Again',
            action: 'post',
          },
        ],
        input: {
          text: 'Enter your content prompt here...',
        },
        post_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/frame/action`,
      },
      content: 'An error occurred. Please try again.',
    });
  }
} 