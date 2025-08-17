import { NextRequest, NextResponse } from 'next/server';
import { aiTrainingService } from '../../../../lib/aiTrainingService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const recommendations = await aiTrainingService.getContentRecommendations(userId);
    
    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 