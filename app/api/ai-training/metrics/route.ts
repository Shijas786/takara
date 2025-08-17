import { NextRequest, NextResponse } from 'next/server';
import { aiTrainingService } from '../../../../lib/aiTrainingService';

export async function GET(request: NextRequest) {
  try {
    const metrics = await aiTrainingService.getTrainingMetrics();
    
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error getting training metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get training metrics' },
      { status: 500 }
    );
  }
} 