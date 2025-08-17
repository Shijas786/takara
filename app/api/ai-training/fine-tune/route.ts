import { NextRequest, NextResponse } from 'next/server';
import { aiTrainingService } from '../../../../lib/aiTrainingService';

export async function POST(request: NextRequest) {
  try {
    const { style } = await request.json();
    
    if (!style) {
      return NextResponse.json(
        { error: 'Style parameter is required' },
        { status: 400 }
      );
    }

    // Trigger fine-tuning for the specified style
    await aiTrainingService.fineTuneModel(style);
    
    return NextResponse.json({
      success: true,
      message: `Fine-tuning initiated for ${style} style`,
    });
  } catch (error) {
    console.error('Error fine-tuning model:', error);
    return NextResponse.json(
      { error: 'Failed to fine-tune model' },
      { status: 500 }
    );
  }
} 