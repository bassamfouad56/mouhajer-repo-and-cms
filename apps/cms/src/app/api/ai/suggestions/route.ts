import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { content, contentType, action } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        suggestions: getAlgorithmicSuggestions(content, contentType)
      });
    }

    const groq = new Groq({ apiKey });

    if (action === 'generate') {
      const prompt = `Analyze this ${contentType || 'content'} and provide 5-8 specific suggestions:

Content: ${content}

Provide suggestions in these categories:
1. Headlines: Catchy, SEO-optimized titles
2. Paragraphs: Better ways to phrase key points
3. CTAs: Strong call-to-action phrases
4. Keywords: Important SEO keywords to include
5. Improvements: Specific ways to enhance the content

Format each suggestion as:
TYPE: [suggestion text]
REASON: [brief explanation]`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a content optimization expert. Provide concise, actionable suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 800
      });

      const suggestionsText = completion.choices[0]?.message?.content || '';
      const suggestions = parseSuggestions(suggestionsText);

      return NextResponse.json({ suggestions });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI suggestions error:', error);

    // Fallback to algorithmic suggestions
    return NextResponse.json({
      suggestions: getAlgorithmicSuggestions('', '')
    });
  }
}

function parseSuggestions(text: string): any[] {
  const suggestions = [];
  const lines = text.split('\n');

  let currentSuggestion: any = null;

  for (const line of lines) {
    if (line.startsWith('HEADLINE:')) {
      if (currentSuggestion) suggestions.push(currentSuggestion);
      currentSuggestion = {
        type: 'headline',
        text: line.replace('HEADLINE:', '').trim()
      };
    } else if (line.startsWith('PARAGRAPH:')) {
      if (currentSuggestion) suggestions.push(currentSuggestion);
      currentSuggestion = {
        type: 'paragraph',
        text: line.replace('PARAGRAPH:', '').trim()
      };
    } else if (line.startsWith('CTA:')) {
      if (currentSuggestion) suggestions.push(currentSuggestion);
      currentSuggestion = {
        type: 'cta',
        text: line.replace('CTA:', '').trim()
      };
    } else if (line.startsWith('KEYWORD:')) {
      if (currentSuggestion) suggestions.push(currentSuggestion);
      currentSuggestion = {
        type: 'keyword',
        text: line.replace('KEYWORD:', '').trim()
      };
    } else if (line.startsWith('IMPROVEMENT:')) {
      if (currentSuggestion) suggestions.push(currentSuggestion);
      currentSuggestion = {
        type: 'improvement',
        text: line.replace('IMPROVEMENT:', '').trim()
      };
    } else if (line.startsWith('REASON:') && currentSuggestion) {
      currentSuggestion.reason = line.replace('REASON:', '').trim();
    }
  }

  if (currentSuggestion) suggestions.push(currentSuggestion);

  return suggestions;
}

function getAlgorithmicSuggestions(content: string, contentType: string): any[] {
  const suggestions = [];

  // Basic algorithmic suggestions
  suggestions.push({
    type: 'headline',
    text: 'Transform Your Business Today',
    reason: 'Strong, action-oriented headline'
  });

  suggestions.push({
    type: 'cta',
    text: 'Get Started Now →',
    reason: 'Clear call-to-action with visual indicator'
  });

  suggestions.push({
    type: 'keyword',
    text: 'professional services',
    reason: 'High-value keyword for SEO'
  });

  // Content-based suggestions
  if (content.length < 300) {
    suggestions.push({
      type: 'improvement',
      text: 'Add more detailed information to improve SEO',
      reason: 'Content should be at least 300 words'
    });
  }

  if (!content.includes('?')) {
    suggestions.push({
      type: 'paragraph',
      text: 'Consider adding a question to engage readers',
      reason: 'Questions increase engagement'
    });
  }

  return suggestions;
}