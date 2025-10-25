import { NextRequest, NextResponse } from 'next/server';
import { analyzeSEO, getRealtimeSuggestions, getContentImprovements } from '@/lib/seo-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'analyze':
        const analysis = analyzeSEO(params);
        const improvements = getContentImprovements(analysis);
        return NextResponse.json({ analysis, improvements });

      case 'realtime':
        const suggestions = getRealtimeSuggestions(
          params.field,
          params.value,
          params.keywords
        );
        return NextResponse.json({ suggestions });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('SEO Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze SEO' },
      { status: 500 }
    );
  }
}