import { NextRequest, NextResponse } from 'next/server';
import { generateContent, generateOutline, improveContent, generateSEOTags } from '@/lib/ai-content-writer';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'generate':
        const content = await generateContent(params);
        return NextResponse.json(content);

      case 'outline':
        const outline = await generateOutline(params.topic, params.contentType);
        return NextResponse.json({ outline });

      case 'improve':
        const improved = await improveContent(params.content, params.improvements);
        return NextResponse.json({ content: improved });

      case 'seo-tags':
        const tags = await generateSEOTags(params.content, params.topic);
        return NextResponse.json(tags);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Content API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}