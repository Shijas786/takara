import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeResponse } from '../../../../lib/sanitizeResponse';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.from('test').select('*').limit(1);
    if (error) throw error;
    return NextResponse.json(sanitizeResponse({ data }));
  } catch (error) {
    return NextResponse.json(sanitizeResponse({ error: (error as Error).message }), { status: 500 });
  }
} 